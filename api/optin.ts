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
  const confirmation_token = randomUUID();
  const { error: dbError } = await supabase.from("subscribers").upsert(
    {
      first_name: first_name || null,
      email,
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
  const siteUrl = process.env.VITE_APP_URL || "https://app.culinarymedicineuk.training";
  const confirmUrl = `${siteUrl}/confirm?token=${confirmation_token}`;
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Fuel Your Future <onboarding@culinarymedicineuk.training>",
      to: email,
      subject: "Confirm your Fuel Your Future subscription",
      html: generateConfirmationEmail(first_name || "there", confirmUrl),
    });
  } catch (emailError: any) {
    console.error("Resend send error:", emailError?.message);
    return res.status(500).json({ error: "Saved, but could not send confirmation email." });
  }
  return res.status(200).json({ success: true });
}
