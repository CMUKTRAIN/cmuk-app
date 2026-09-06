import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = typeof req.query.token === "string" ? req.query.token : null;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, first_name, email, status")
    .eq("confirmation_token", token)
    .single();
  if (error || !data) {
    return res.status(404).json({ error: "Invalid or expired confirmation link" });
  }
  if (data.status !== "confirmed") {
    const { error: updateError } = await supabase
      .from("subscribers")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updateError) {
      console.error("Supabase confirm update error:", updateError.message);
      return res.status(500).json({ error: "Could not confirm your email. Please try again." });
    }
  }
  return res.status(200).json({
    success: true,
    user: { first_name: data.first_name, email: data.email },
  });
}
