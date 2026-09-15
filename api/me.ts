import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["cmuk_session"];

  if (!token) {
    return res.status(401).json({ error: "Not signed in" });
  }

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, first_name, email, has_allergens, allergens, session_expires_at")
    .eq("session_token", token)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid session" });
  }

  if (new Date(data.session_expires_at) < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }

  return res.status(200).json({
    id: data.id,
    first_name: data.first_name,
    email: data.email,
    has_allergens: data.has_allergens,
    allergens: data.allergens,
  });
}
