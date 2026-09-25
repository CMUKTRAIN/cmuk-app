import type { VercelRequest } from "@vercel/node";
import { supabase } from "./supabase.js";

export interface SessionUser {
  id: string;
  first_name: string | null;
  email: string;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export async function verifySession(req: VercelRequest): Promise<SessionUser | null> {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["cmuk_session"];
  if (!token) return null;

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, first_name, email, session_expires_at")
    .eq("session_token", token)
    .single();

  if (error || !data) return null;
  if (new Date(data.session_expires_at) < new Date()) return null;

  return {
    id: data.id,
    first_name: data.first_name ?? null,
    email: data.email,
  };
}
