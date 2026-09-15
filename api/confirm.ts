import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { supabase } from "../server/lib/supabase.js";

const SESSION_TTL_DAYS = 30;
const APP_URL = "https://app.culinarymedicineuk.training";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = typeof req.query.token === "string" ? req.query.token : null;
  if (!token) {
    return res.redirect(302, `${APP_URL}/?error=missing-token`);
  }

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, first_name, email, status")
    .eq("confirmation_token", token)
    .single();

  if (error || !data) {
    return res.redirect(302, `${APP_URL}/?error=invalid-link`);
  }

  const sessionToken = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  const updates: Record<string, unknown> = {
    session_token: sessionToken,
    session_expires_at: expiresAt.toISOString(),
    last_signin_at: new Date().toISOString(),
  };

  if (data.status !== "confirmed") {
    updates.status = "confirmed";
    updates.confirmed_at = new Date().toISOString();
    updates.confirmation_token = null;
  }

  const { error: updateError } = await supabase
    .from("subscribers")
    .update(updates)
    .eq("id", data.id);

  if (updateError) {
    console.error("Supabase confirm update error:", updateError.message);
    return res.redirect(302, `${APP_URL}/?error=server`);
  }

  res.setHeader(
    "Set-Cookie",
    `cmuk_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_DAYS * 24 * 60 * 60}`
  );

  const welcome = data.status === "confirmed" ? "back" : "1";
  return res.redirect(302, `${APP_URL}/app?welcome=${welcome}`);
}
