import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { event_type, user_email, metadata } = body || {};

  if (!event_type || typeof event_type !== "string") {
    return res.status(400).json({ error: "event_type is required" });
  }

  const { error } = await supabase.from("events").insert({
    event_type,
    user_email: user_email || null,
    metadata: metadata || null,
  });

  if (error) {
    console.error("Supabase event insert error:", error.message);
    return res.status(500).json({ error: "Could not log event" });
  }

  return res.status(200).json({ success: true });
}
