import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";
import { requireAdmin } from "./_lib/adminAuth.js";
import { SERVER_CHALLENGES } from "../server/lib/challengeData.js";

const BUCKET = "challenge-proofs";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 4;
const DEFAULT_AGE_DAYS = 30;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = (req.query.action as string) || "";

  const auth = await requireAdmin(req);
  if ("error" in auth) return res.status(auth.status).json({ error: auth.error });

  // ---------------------------------------------------------------
  // action=students  (GET)
  // ---------------------------------------------------------------
  if (action === "students") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { data: rows, error } = await supabase
      .from("challenge_submissions")
      .select(
        "id, subscriber_id, student_email, first_name, class_group, student_number, challenge_id, challenge_title, challenge_week, photo_path, submitted_at"
      )
      .order("submitted_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Admin students fetch error:", error.message);
      return res.status(500).json({ error: "Could not load submissions" });
    }

    const paths = (rows ?? []).map((r) => r.photo_path);
    const signedMap = new Map<string, string>();
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
      (signed ?? []).forEach((s) => {
        if (s.signedUrl && s.path) signedMap.set(s.path, s.signedUrl);
      });
    }

    const byStudent = new Map<
      string,
      {
        email: string;
        first_name: string | null;
        submissions: Array<{
          id: string;
          challenge_id: string;
          challenge_title: string;
          challenge_week: number;
          class_group: string;
          student_number: string;
          submitted_at: string;
          photo_signed_url: string | null;
        }>;
      }
    >();

    for (const r of rows ?? []) {
      const key = r.student_email;
      if (!byStudent.has(key)) {
        byStudent.set(key, { email: r.student_email, first_name: r.first_name, submissions: [] });
      }
      byStudent.get(key)!.submissions.push({
        id: r.id,
        challenge_id: r.challenge_id,
        challenge_title: r.challenge_title,
        challenge_week: r.challenge_week,
        class_group: r.class_group,
        student_number: r.student_number,
        submitted_at: r.submitted_at,
        photo_signed_url: signedMap.get(r.photo_path) ?? null,
      });
    }

    const students = Array.from(byStudent.values()).map((s) => ({
      ...s,
      completed_count: s.submissions.length,
      total_challenges: SERVER_CHALLENGES.length,
    }));

    students.sort((a, b) => b.completed_count - a.completed_count);

    return res.status(200).json({
      total_submissions: rows?.length ?? 0,
      total_students: students.length,
      students,
    });
  }

  // ---------------------------------------------------------------
  // action=events  (GET)
  // ---------------------------------------------------------------
  if (action === "events") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabase
      .from("events")
      .select("event_type, user_email, created_at")
      .gte("created_at", sinceIso);

    if (error) {
      console.error("Admin events fetch error:", error.message);
      return res.status(500).json({ error: "Could not load events" });
    }

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

  // ---------------------------------------------------------------
  // action=dashboard  (GET) — everything the admin page needs in one call
  // ---------------------------------------------------------------
  if (action === "dashboard") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const now = new Date();
    const since14Iso = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const since7Iso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since30Iso = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Run all queries in parallel
    const [
      subscribersRes,
      submissionsRes,
      events30Res,
      events7Res,
    ] = await Promise.all([
      supabase
        .from("subscribers")
        .select("email, first_name, created_at, status"),
      supabase
        .from("challenge_submissions")
        .select("id, student_email, first_name, challenge_id, challenge_week, submitted_at"),
      supabase
        .from("events")
        .select("event_type, user_email, created_at")
        .gte("created_at", since30Iso),
      supabase
        .from("events")
        .select("user_email")
        .gte("created_at", since7Iso),
    ]);

    if (subscribersRes.error || submissionsRes.error || events30Res.error || events7Res.error) {
      console.error("Dashboard fetch error:", {
        s: subscribersRes.error?.message,
        sub: submissionsRes.error?.message,
        e30: events30Res.error?.message,
        e7: events7Res.error?.message,
      });
      return res.status(500).json({ error: "Could not load dashboard" });
    }

    const subscribers = subscribersRes.data ?? [];
    const submissions = submissionsRes.data ?? [];
    const events30 = events30Res.data ?? [];
    const events7 = events7Res.data ?? [];

    // ---------- KPIs ----------
    const totalStudents = subscribers.filter((s) => s.status === "confirmed" || s.status === "active").length;
    const activeThisWeek = new Set(events7.map((e) => e.user_email).filter(Boolean)).size;
    const totalSubmissions = submissions.length;
    const uniqueSubmitters = new Set(submissions.map((s) => s.student_email)).size;

    // ---------- Registrations Over Time (last 14 days) ----------
    const registrationsByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      registrationsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const s of subscribers) {
      const day = (s.created_at || "").slice(0, 10);
      if (day in registrationsByDay) registrationsByDay[day]++;
    }
    const registrationsSeries = Object.entries(registrationsByDay).map(([date, count]) => ({ date, count }));

    // ---------- Feature Engagement ----------
    const eventCounts: Record<string, number> = {};
    for (const e of events30) {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    }
    // Add derived counts from non-event tables
    const featureEngagement = [
      { label: "Registered", count: subscribers.length },
      { label: "Built a Plate", count: eventCounts["plate_built"] || 0 },
      { label: "Viewed a Recipe", count: eventCounts["recipe_viewed"] || 0 },
      { label: "Favourited Recipe", count: eventCounts["recipe_favorited"] || 0 },
      { label: "Completed Challenge", count: submissions.length },
      { label: "Read Mythbuster", count: eventCounts["myth_read"] || 0 },
    ];

    // ---------- Most Active Students (leaderboard) ----------
    const byStudent: Record<string, { plates: number; challenges: number; total: number; first_name: string | null }> = {};
    for (const e of events30) {
      if (!e.user_email) continue;
      if (!byStudent[e.user_email]) byStudent[e.user_email] = { plates: 0, challenges: 0, total: 0, first_name: null };
      if (e.event_type === "plate_built") byStudent[e.user_email].plates++;
      byStudent[e.user_email].total++;
    }
    for (const s of submissions) {
      const key = s.student_email;
      if (!byStudent[key]) byStudent[key] = { plates: 0, challenges: 0, total: 0, first_name: s.first_name };
      byStudent[key].challenges++;
      byStudent[key].total++;
      if (!byStudent[key].first_name && s.first_name) byStudent[key].first_name = s.first_name;
    }
    // Backfill names from subscribers
    const emailToName = new Map(subscribers.map((s) => [s.email, s.first_name]));
    for (const [email, stats] of Object.entries(byStudent)) {
      if (!stats.first_name) stats.first_name = emailToName.get(email) ?? null;
    }
    const leaderboard = Object.entries(byStudent)
      .map(([email, stats]) => ({ email, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // ---------- Daily volume (last 30 days) ----------
    const dailyVolume: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyVolume[d.toISOString().slice(0, 10)] = 0;
    }
    for (const e of events30) {
      const day = e.created_at.slice(0, 10);
      if (day in dailyVolume) dailyVolume[day]++;
    }
    const dailySeries = Object.entries(dailyVolume).map(([date, count]) => ({ date, count }));

    // ---------- Challenge breakdown ----------
    const challengeCounts: Record<string, number> = {};
    for (const ch of SERVER_CHALLENGES) challengeCounts[ch.id] = 0;
    for (const s of submissions) {
      if (s.challenge_id in challengeCounts) challengeCounts[s.challenge_id]++;
    }
    const challengeBreakdown = SERVER_CHALLENGES.map((c) => ({
      id: c.id,
      title: c.title,
      week: c.week,
      count: challengeCounts[c.id] || 0,
    }));

    return res.status(200).json({
      kpis: {
        totalStudents,
        activeThisWeek,
        totalSubmissions,
        uniqueSubmitters,
      },
      registrationsSeries,
      featureEngagement,
      leaderboard,
      dailySeries,
      challengeBreakdown,
    });
  }

  // ---------------------------------------------------------------
  // action=leaderboard  (GET) — kept as its own action if you want it standalone
  // ---------------------------------------------------------------
  if (action === "leaderboard") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [eventsRes, subsRes, subscribersRes] = await Promise.all([
      supabase.from("events").select("event_type, user_email").gte("created_at", sinceIso),
      supabase.from("challenge_submissions").select("student_email, first_name"),
      supabase.from("subscribers").select("email, first_name"),
    ]);

    if (eventsRes.error || subsRes.error || subscribersRes.error) {
      return res.status(500).json({ error: "Could not load leaderboard" });
    }

    const byStudent: Record<string, { plates: number; challenges: number; total: number; first_name: string | null }> = {};
    for (const e of eventsRes.data ?? []) {
      if (!e.user_email) continue;
      if (!byStudent[e.user_email]) byStudent[e.user_email] = { plates: 0, challenges: 0, total: 0, first_name: null };
      if (e.event_type === "plate_built") byStudent[e.user_email].plates++;
      byStudent[e.user_email].total++;
    }
    for (const s of subsRes.data ?? []) {
      const key = s.student_email;
      if (!byStudent[key]) byStudent[key] = { plates: 0, challenges: 0, total: 0, first_name: s.first_name };
      byStudent[key].challenges++;
      byStudent[key].total++;
    }
    const emailToName = new Map((subscribersRes.data ?? []).map((s) => [s.email, s.first_name]));
    for (const [email, stats] of Object.entries(byStudent)) {
      if (!stats.first_name) stats.first_name = emailToName.get(email) ?? null;
    }

    const leaderboard = Object.entries(byStudent)
      .map(([email, stats]) => ({ email, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return res.status(200).json({ leaderboard });
  }

  // ---------------------------------------------------------------
  // action=registrations  (GET)
  // ---------------------------------------------------------------
  if (action === "registrations") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { data: rows, error } = await supabase
      .from("subscribers")
      .select("created_at");

    if (error) return res.status(500).json({ error: "Could not load registrations" });

    const now = new Date();
    const byDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      byDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const r of rows ?? []) {
      const day = (r.created_at || "").slice(0, 10);
      if (day in byDay) byDay[day]++;
    }

    return res.status(200).json({
      series: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    });
  }

  // ---------------------------------------------------------------
  // action=cleanup  (POST)
  // ---------------------------------------------------------------
  if (action === "cleanup") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const ageDays = Number.isFinite(body.age_days) ? Math.max(1, Number(body.age_days)) : DEFAULT_AGE_DAYS;
    const dryRun = body.dry_run !== false;

    const cutoffIso = new Date(Date.now() - ageDays * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error: fetchError } = await supabase
      .from("challenge_submissions")
      .select("id, photo_path, submitted_at, student_email")
      .lt("submitted_at", cutoffIso);

    if (fetchError) return res.status(500).json({ error: "Could not fetch submissions" });

    const candidates = rows ?? [];

    if (dryRun) {
      return res.status(200).json({
        dry_run: true,
        age_days: ageDays,
        cutoff_iso: cutoffIso,
        would_delete_count: candidates.length,
        would_delete: candidates.map((r) => ({
          id: r.id,
          email: r.student_email,
          submitted_at: r.submitted_at,
        })),
      });
    }

    if (candidates.length === 0) {
      return res.status(200).json({ dry_run: false, age_days: ageDays, deleted_count: 0, message: "Nothing to delete." });
    }

    const paths = candidates.map((r) => r.photo_path);
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
    if (storageError) return res.status(500).json({ error: "Could not delete photos" });

    const ids = candidates.map((r) => r.id);
    const { error: dbError } = await supabase.from("challenge_submissions").delete().in("id", ids);
    if (dbError) return res.status(500).json({ error: "Photos deleted, but DB rows failed to delete" });

    return res.status(200).json({
      dry_run: false,
      age_days: ageDays,
      deleted_count: candidates.length,
      deleted_photos: paths.length,
      deleted_rows: ids.length,
    });
  }

  return res.status(400).json({ error: "Unknown action. Use ?action=students|events|dashboard|leaderboard|registrations|cleanup" });
}
