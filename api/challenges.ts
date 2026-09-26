import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";
import { verifySession } from "../server/lib/verifySession.js";
import {
  SERVER_CHALLENGES,
  SERVER_BADGES,
  getChallenge,
} from "../server/lib/challengeData.js";

interface ProgressRow {
  challenge_id: string;
  completed: boolean;
  completed_at: string | null;
  points_awarded: number;
}

interface SubmissionRow {
  challenge_id: string;
  photo_path: string;
}

const BUCKET = "challenge-proofs";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour — short-lived for UI

async function buildProgressPayload(subscriberId: string) {
  const [{ data: progressRows }, { data: submissionRows }] = await Promise.all([
    supabase
      .from("challenge_progress")
      .select("challenge_id, completed, completed_at, points_awarded")
      .eq("subscriber_id", subscriberId),
    supabase
      .from("challenge_submissions")
      .select("challenge_id, photo_path")
      .eq("subscriber_id", subscriberId),
  ]);

  const progressMap = new Map<string, ProgressRow>();
  (progressRows ?? []).forEach((r) => progressMap.set(r.challenge_id, r as ProgressRow));

  const submissionMap = new Map<string, SubmissionRow>();
  (submissionRows ?? []).forEach((r) => submissionMap.set(r.challenge_id, r as SubmissionRow));

  // Batch-sign all photo URLs
  const signedUrls = new Map<string, string>();
  const pathsToSign = (submissionRows ?? []).map((r) => r.photo_path);
  if (pathsToSign.length > 0) {
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(pathsToSign, SIGNED_URL_TTL_SECONDS);
    (signed ?? []).forEach((s) => {
      if (s.signedUrl && s.path) signedUrls.set(s.path, s.signedUrl);
    });
  }

  const challenges = SERVER_CHALLENGES.map((c) => {
    const p = progressMap.get(c.id);
    const sub = submissionMap.get(c.id);
    const photoSignedUrl = sub ? signedUrls.get(sub.photo_path) ?? null : null;
    return {
      id: c.id,
      week: c.week,
      title: c.title,
      points: c.points,
      badgeId: c.badgeId,
      completed: p?.completed ?? false,
      completedAt: p?.completed_at ?? null,
      targetCount: 1,
      currentCount: p?.completed ? 1 : 0,
      submitted: Boolean(sub),
      photoSignedUrl,
    };
  });

  const completedCount = challenges.filter((c) => c.completed).length;

  const badges = SERVER_BADGES.map((b) => {
    const owner = SERVER_CHALLENGES.find((c) => c.badgeId === b.id);
    const isUnlocked = owner
      ? challenges.find((c) => c.id === owner.id)?.completed ?? false
      : false;
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      color: b.accentColor,
      unlocked: isUnlocked,
    };
  });

  const userPoints = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.points, 0);

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("challenge_streak")
    .eq("id", subscriberId)
    .single();

  const streakDays = subscriber?.challenge_streak ?? 0;

  return {
    challenges,
    badges,
    userPoints,
    streakDays,
    completedCount,
    totalCount: challenges.length,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await verifySession(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });

  // ---- GET --------------------------------------------------------
  if (req.method === "GET") {
    try {
      const payload = await buildProgressPayload(user.id);
      return res.status(200).json(payload);
    } catch (err: any) {
      console.error("GET /api/challenges error:", err?.message);
      return res.status(500).json({ error: "Could not load progress" });
    }
  }

  // ---- POST -------------------------------------------------------
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { challenge_id, completed } = body;

    if (!challenge_id || typeof challenge_id !== "string") {
      return res.status(400).json({ error: "challenge_id is required" });
    }
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean" });
    }

    const challenge = getChallenge(challenge_id);
    if (!challenge) return res.status(400).json({ error: "Unknown challenge" });

    // 🔒 Lock check: cannot un-complete if a submission exists
    const { data: submission } = await supabase
      .from("challenge_submissions")
      .select("id")
      .eq("subscriber_id", user.id)
      .eq("challenge_id", challenge.id)
      .maybeSingle();

    if (submission && completed === false) {
      return res.status(403).json({
        error: "This challenge is locked — you've already submitted proof.",
      });
    }

    const { data: existing } = await supabase
      .from("challenge_progress")
      .select("id, completed")
      .eq("subscriber_id", user.id)
      .eq("challenge_id", challenge_id)
      .maybeSingle();

    const row = {
      subscriber_id: user.id,
      challenge_id: challenge.id,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      points_awarded: completed ? challenge.points : 0,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("challenge_progress")
      .upsert(row, { onConflict: "subscriber_id,challenge_id" });

    if (upsertError) {
      console.error("Toggle upsert error:", upsertError.message);
      return res.status(500).json({ error: "Could not save progress" });
    }

    const actuallyChanged = (existing?.completed ?? false) !== completed;
    if (actuallyChanged) {
      const { data: sub } = await supabase
        .from("subscribers")
        .select("challenge_streak")
        .eq("id", user.id)
        .single();

      const current = sub?.challenge_streak ?? 0;
      const next = completed
        ? Math.max(current + 1, 1)
        : Math.max(current - 1, 0);

      await supabase
        .from("subscribers")
        .update({ challenge_streak: next })
        .eq("id", user.id);
    }

    const payload = await buildProgressPayload(user.id);
    return res.status(200).json({ success: true, ...payload });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
