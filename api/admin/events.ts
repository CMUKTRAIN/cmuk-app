import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../server/lib/supabase.js";
import { requireAdmin } from "../_lib/adminAuth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await requireAdmin(req);
  if ("error" in auth) return res.status(auth.status).json({ error: auth.error });

  const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await supabase
    .from("events")
    .select("event_type, user_email, created_at")
    .gte("created_at", sinceIso);

  if (error) {
    console.error("Admin events fetch error:", error.message);
    return res.status(500).json({ error: "Could not load events" });
  }

  // Counts by event type
  const byType = new Map<string, number>();
  const byEmail = new Map<string, number>();
  const daily = new Map<string, number>();

  for (const r of rows ?? []) {
    byType.set(r.event_type, (byType.get(r.event_type) ?? 0) + 1);
    if (r.user_email) byEmail.set(r.user_email, (byEmail.get(r.user_email) ?? 0) + 1);
    const day = r.created_at.slice(0, 10);
    daily.set(day, (daily.get(day) ?? 0) + 1);
  }

  return res.status(200).json({
    window_days: 30,
    total_events: rows?.length ?? 0,
    by_type: Array.from(byType.entries())
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count),
    top_users: Array.from(byEmail.entries())
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    daily: Array.from(daily.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  });
}
