import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";
import { requireAdmin } from "./_lib/adminAuth.js";
import { resend } from "../server/lib/resend.js";
import { SERVER_CHALLENGES, getBadge } from "../server/lib/challengeData.js";
import {
  generateApprovalEmail,
  generateRejectionEmail,
} from "../server/lib/challengeEmailTemplates.js";

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
        "id, subscriber_id, student_email, first_name, class_group, student_number, challenge_id, challenge_title, challenge_week, photo_path, submitted_at, review_status"
      )
      .eq("review_status", "approved")
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
  // action=pending  (GET) — review queue
  // ---------------------------------------------------------------
  if (action === "pending") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { data: rows, error } = await supabase
      .from("challenge_submissions")
      .select(
        "id, subscriber_id, student_email, first_name, class_group, student_number, challenge_id, challenge_title, challenge_week, photo_path, submitted_at"
      )
      .eq("review_status", "pending")
      .order("submitted_at", { ascending: true })
      .limit(200);

    if (error) {
      console.error("Pending fetch error:", error.message);
      return res.status(500).json({ error: "Could not load pending submissions" });
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

    const submissions = (rows ?? []).map((r) => ({
      id: r.id,
      student_email: r.student_email,
      first_name: r.first_name,
      class_group: r.class_group,
      student_number: r.student_number,
      challenge_id: r.challenge_id,
      challenge_title: r.challenge_title,
      challenge_week: r.challenge_week,
      submitted_at: r.submitted_at,
      photo_signed_url: signedMap.get(r.photo_path) ?? null,
    }));

    return res.status(200).json({ total: submissions.length, submissions });
  }

  // ---------------------------------------------------------------
  // action=review  (POST) — approve or reject
  // ---------------------------------------------------------------
  if (action === "review") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { submission_id, decision } = body;

    if (!submission_id || typeof submission_id !== "string") {
      return res.status(400).json({ error: "submission_id is required" });
    }
    if (decision !== "approve" && decision !== "reject") {
      return res.status(400).json({ error: "decision must be 'approve' or 'reject'" });
    }

    const { data: submission, error: fetchErr } = await supabase
      .from("challenge_submissions")
      .select("id, subscriber_id, student_email, first_name, challenge_id, challenge_title, challenge_week, review_status")
      .eq("id", submission_id)
      .single();

    if (fetchErr || !submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    if (submission.review_status !== "pending") {
      return res.status(409).json({ error: `Already ${submission.review_status}` });
    }

    const now = new Date().toISOString();

    if (decision === "approve") {
      const challenge = SERVER_CHALLENGES.find((c) => c.id === submission.challenge_id);
      if (!challenge) return res.status(400).json({ error: "Unknown challenge on submission" });

      // 1. Mark approved
      const { error: updErr } = await supabase
        .from("challenge_submissions")
        .update({
          review_status: "approved",
          reviewed_at: now,
          reviewed_by: auth.user.email,
        })
        .eq("id", submission_id);

      if (updErr) return res.status(500).json({ error: "Could not update submission" });

      // 2. Upsert challenge_progress
      const { data: existingProgress } = await supabase
        .from("challenge_progress")
        .select("completed")
        .eq("subscriber_id", submission.subscriber_id)
        .eq("challenge_id", challenge.id)
        .maybeSingle();

      await supabase.from("challenge_progress").upsert(
        {
          subscriber_id: submission.subscriber_id,
          challenge_id: challenge.id,
          completed: true,
          completed_at: now,
          points_awarded: challenge.points,
          updated_at: now,
        },
        { onConflict: "subscriber_id,challenge_id" }
      );

      // 3. Bump streak only if this is a fresh approval
      if (!existingProgress?.completed) {
        const { data: sub } = await supabase
          .from("subscribers")
          .select("challenge_streak")
          .eq("id", submission.subscriber_id)
          .single();
        const newStreak = Math.max((sub?.challenge_streak ?? 0) + 1, 1);
        await supabase
          .from("subscribers")
          .update({ challenge_streak: newStreak })
          .eq("id", submission.subscriber_id);
      }

      // 4. Log challenge_completed event
      try {
        await supabase.from("events").insert({
          event_type: "challenge_completed",
          user_email: submission.student_email,
          metadata: {
            challenge_id: challenge.id,
            challenge_week: challenge.week,
            submission_id: submission.id,
          },
        });
      } catch (e: any) {
        console.warn("Event log failed:", e?.message);
      }

      // 5. Send approval email
      const badge = getBadge(challenge.badgeId);
      const { data: allProgress } = await supabase
        .from("challenge_progress")
        .select("points_awarded, completed")
        .eq("subscriber_id", submission.subscriber_id)
        .eq("completed", true);
      const userPoints = (allProgress ?? []).reduce((s, r) => s + (r.points_awarded ?? 0), 0);

      if (badge) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: submission.student_email,
            subject: `Approved! ${challenge.title} 🎉`,
            html: generateApprovalEmail({
              firstName: submission.first_name,
              challengeTitle: challenge.title,
              challengeWeek: challenge.week,
              badgeName: badge.name,
              badgeIcon: badge.icon,
              badgeDescription: badge.description,
              pointsEarned: challenge.points,
              userPoints,
            }),
          });
          await supabase
            .from("challenge_submissions")
            .update({ student_email_sent: true })
            .eq("id", submission_id);
        } catch (e: any) {
          console.error("Approval email error:", e?.message);
        }
      }

      return res.status(200).json({ success: true, decision: "approve" });
    }

    // Reject
    const { error: rejErr } = await supabase
      .from("challenge_submissions")
      .update({
        review_status: "rejected",
        reviewed_at: now,
        reviewed_by: auth.user.email,
      })
      .eq("id", submission_id);

    if (rejErr) return res.status(500).json({ error: "Could not update submission" });

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: submission.student_email,
        subject: `We need a different photo for ${submission.challenge_title}`,
        html: generateRejectionEmail({
          firstName: submission.first_name,
          challengeTitle: submission.challenge_title,
          challengeWeek: submission.challenge_week,
        }),
      });
      await supabase
        .from("challenge_submissions")
        .update({ student_email_sent: true })
        .eq("id", submission_id);
    } catch (e: any) {
      console.error("Rejection email error:", e?.message);
    }

    return res.status(200).json({ success: true, decision: "reject" });
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

    if (error) return res.status(500).json({ error: "Could not load events" });

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
      by_type: Array.from(byType.entries()).map(([event_type, count]) => ({ event_type, count })).sort((a, b) => b.count - a.count),
      top_users: Array.from(byEmail.entries()).map(([email, count]) => ({ email, count })).sort((a, b) => b.count - a.count).slice(0, 20),
      daily: Array.from(daily.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    });
  }

  // ---------------------------------------------------------------
  // action=dashboard  (GET)
  // ---------------------------------------------------------------
  if (action === "dashboard") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const now = new Date();
    const since7Iso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since30Iso = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [subsRes, subs2Res, ev30Res, ev7Res, pendRes] = await Promise.all([
      supabase.from("subscribers").select("email, first_name, created_at, status"),
      supabase.from("challenge_submissions").select("id, student_email, first_name, challenge_id, challenge_week, submitted_at, review_status"),
      supabase.from("events").select("event_type, user_email, created_at").gte("created_at", since30Iso),
      supabase.from("events").select("user_email").gte("created_at", since7Iso),
      supabase.from("challenge_submissions").select("id").eq("review_status", "pending"),
    ]);

    if (subsRes.error || subs2Res.error || ev30Res.error || ev7Res.error || pendRes.error) {
      return res.status(500).json({ error: "Could not load dashboard" });
    }

    const subscribers = subsRes.data ?? [];
    const submissions = (subs2Res.data ?? []).filter((s) => s.review_status === "approved");
    const events30 = ev30Res.data ?? [];
    const events7 = ev7Res.data ?? [];
    const pendingCount = (pendRes.data ?? []).length;

    const totalStudents = subscribers.filter((s) => s.status === "confirmed" || s.status === "active").length;
    const activeThisWeek = new Set(events7.map((e) => e.user_email).filter(Boolean)).size;

    const registrationsByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      registrationsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const s of subscribers) {
      const day = (s.created_at || "").slice(0, 10);
      if (day in registrationsByDay) registrationsByDay[day]++;
    }
    const registrationsSeries = Object.entries(registrationsByDay).map(([date, count]) => ({ date, count }));

    const eventCounts: Record<string, number> = {};
    for (const e of events30) eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;

    const featureEngagement = [
      { label: "Registered", count: subscribers.length },
      { label: "Built a Plate", count: eventCounts["plate_built"] || 0 },
      { label: "Viewed a Recipe", count: eventCounts["recipe_viewed"] || 0 },
      { label: "Favourited Recipe", count: eventCounts["recipe_favorited"] || 0 },
      { label: "Completed Challenge", count: submissions.length },
      { label: "Read Mythbuster", count: eventCounts["myth_read"] || 0 },
    ];

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
    const emailToName = new Map(subscribers.map((s) => [s.email, s.first_name]));
    for (const [email, stats] of Object.entries(byStudent)) {
      if (!stats.first_name) stats.first_name = emailToName.get(email) ?? null;
    }
    const leaderboard = Object.entries(byStudent)
      .map(([email, stats]) => ({ email, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const dailyVolume: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      dailyVolume[d.toISOString().slice(0, 10)] = 0;
    }
    for (const e of events30) {
      const day = e.created_at.slice(0, 10);
      if (day in dailyVolume) dailyVolume[day]++;
    }
    const dailySeries = Object.entries(dailyVolume).map(([date, count]) => ({ date, count }));

    const challengeCounts: Record<string, number> = {};
    for (const ch of SERVER_CHALLENGES) challengeCounts[ch.id] = 0;
    for (const s of submissions) if (s.challenge_id in challengeCounts) challengeCounts[s.challenge_id]++;
    const challengeBreakdown = SERVER_CHALLENGES.map((c) => ({
      id: c.id, title: c.title, week: c.week, count: challengeCounts[c.id] || 0,
    }));

    return res.status(200).json({
      kpis: {
        totalStudents,
        activeThisWeek,
        totalSubmissions: submissions.length,
        uniqueSubmitters: new Set(submissions.map((s) => s.student_email)).size,
        pendingReview: pendingCount,
      },
      registrationsSeries,
      featureEngagement,
      leaderboard,
      dailySeries,
      challengeBreakdown,
    });
  }

  // ---------------------------------------------------------------
  // action=leaderboard  (GET)
  // ---------------------------------------------------------------
  if (action === "leaderboard") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [eventsRes, subsRes, subscribersRes] = await Promise.all([
      supabase.from("events").select("event_type, user_email").gte("created_at", sinceIso),
      supabase.from("challenge_submissions").select("student_email, first_name").eq("review_status", "approved"),
      supabase.from("subscribers").select("email, first_name"),
    ]);
    if (eventsRes.error || subsRes.error || subscribersRes.error) return res.status(500).json({ error: "Could not load leaderboard" });
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
    const leaderboard = Object.entries(byStudent).map(([email, stats]) => ({ email, ...stats })).sort((a, b) => b.total - a.total).slice(0, 10);
    return res.status(200).json({ leaderboard });
  }

  // ---------------------------------------------------------------
  // action=registrations  (GET)
  // ---------------------------------------------------------------
  if (action === "registrations") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const { data: rows, error } = await supabase.from("subscribers").select("created_at");
    if (error) return res.status(500).json({ error: "Could not load registrations" });
    const now = new Date();
    const byDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      byDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const r of rows ?? []) {
      const day = (r.created_at || "").slice(0, 10);
      if (day in byDay) byDay[day]++;
    }
    return res.status(200).json({ series: Object.entries(byDay).map(([date, count]) => ({ date, count })) });
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
    const { data: rows } = await supabase
      .from("challenge_submissions")
      .select("id, photo_path, submitted_at, student_email")
      .lt("submitted_at", cutoffIso);
    const candidates = rows ?? [];
    if (dryRun) return res.status(200).json({ dry_run: true, would_delete_count: candidates.length });
    if (candidates.length === 0) return res.status(200).json({ deleted_count: 0 });
    const paths = candidates.map((r) => r.photo_path);
    const ids = candidates.map((r) => r.id);
    await supabase.storage.from(BUCKET).remove(paths);
    await supabase.from("challenge_submissions").delete().in("id", ids);
    return res.status(200).json({ deleted_count: candidates.length });
  }

  return res.status(400).json({ error: "Unknown action" });
}
