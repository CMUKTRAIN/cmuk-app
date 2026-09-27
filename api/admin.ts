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
  // action=students  (GET) — submissions grouped by student
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
  // action=events  (GET) — event stats
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
  // action=cleanup  (POST) — manual proof cleanup
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

    if (fetchError) {
      console.error("Cleanup fetch error:", fetchError.message);
      return res.status(500).json({ error: "Could not fetch submissions" });
    }

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
      return res.status(200).json({
        dry_run: false,
        age_days: ageDays,
        deleted_count: 0,
        message: "Nothing to delete.",
      });
    }

    const paths = candidates.map((r) => r.photo_path);
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
    if (storageError) {
      console.error("Storage delete error:", storageError.message);
      return res.status(500).json({ error: "Could not delete photos" });
    }

    const ids = candidates.map((r) => r.id);
    const { error: dbError } = await supabase
      .from("challenge_submissions")
      .delete()
      .in("id", ids);

    if (dbError) {
      console.error("DB delete error:", dbError.message);
      return res.status(500).json({ error: "Photos deleted, but DB rows failed to delete" });
    }

    return res.status(200).json({
      dry_run: false,
      age_days: ageDays,
      deleted_count: candidates.length,
      deleted_photos: paths.length,
      deleted_rows: ids.length,
    });
  }

  return res.status(400).json({ error: "Unknown action. Use ?action=students|events|cleanup" });
}
