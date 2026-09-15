import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { supabase } from "../server/lib/supabase.js";
import { resend } from "../server/lib/resend.js";
import { generateConfirmationEmail } from "../server/lib/emailTemplate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { first_name, email, has_allergens, allergens } = body || {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const normalisedEmail = email.toLowerCase().trim();
  const siteUrl = process.env.VITE_APP_URL || "https://app.culinarymedicineuk.training";

  const { data: existing } = await supabase
    .from("subscribers")
    .select("status, first_name")
    .eq("email", normalisedEmail)
    .single();

  if (existing?.status === "confirmed") {
    const signinToken = randomUUID();

    await supabase
      .from("subscribers")
      .update({ confirmation_token: signinToken })
      .eq("email", normalisedEmail);

    const signinUrl = `${siteUrl}/api/confirm?token=${signinToken}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Fuel Your Future <onboarding@culinarymedicineuk.training>",
        to: normalisedEmail,
        subject: "Sign in — Fuel Your Future",
        html: generateConfirmationEmail(existing.first_name || first_name || "there", signinUrl),
      });
    } catch (emailError: any) {
      console.error("Resend send error:", emailError?.message);
      return res.status(500).json({ error: "Could not send sign-in email. Please try again." });
    }

    return res.status(200).json({
      success: true,
      message: "You're already a member — we've sent you a sign-in link.",
    });
  }

  const confirmation_token = randomUUID();

  const { error: dbError } = await supabase.from("subscribers").upsert(
    {
      first_name: first_name || null,
      email: normalisedEmail,
      has_allergens: Boolean(has_allergens),
      allergens: Array.isArray(allergens) ? allergens : [],
      status: "pending",
      confirmation_token,
    },
    { onConflict: "email" }
  );

  if (dbError) {
    console.error("Supabase upsert error:", dbError.message);
    return res.status(500).json({ error: "Could not save your details. Please try again." });
  }

  const confirmUrl = `${siteUrl}/api/confirm?token=${confirmation_token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Fuel Your Future <onboarding@culinarymedicineuk.training>",
      to: normalisedEmail,
      subject: "Confirm & sign in — Fuel Your Future",
      html: generateConfirmationEmail(first_name || "there", confirmUrl),
    });
  } catch (emailError: any) {
    console.error("Resend send error:", emailError?.message);
    return res.status(500).json({ error: "Saved, but could not send confirmation email." });
  }

  return res.status(200).json({ success: true });
}
