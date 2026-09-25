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

// ---------------------------------------------------------------------------
// Shared: build the response payload from DB rows
// ---------------------------------------------------------------------------

async function buildProgressPayload(subscriberId: string) {
  const { data: progressRows } = await supabase
    .from("challenge_progress")
    .select("challenge_id, completed, completed_at, points_awarded")
    .eq("subscriber_id", subscriberId);

  const progressMap = new Map<string, ProgressRow>();
  (progressRows ?? []).forEach((r) => progressMap.set(r.challenge_id, r as ProgressRow));

  // Merge server challenges with progress rows
  const challenges = SERVER_CHALLENGES.map((c) => {
    const p = progressMap.get(c.id);
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
    };
  });

  const completedCount = challenges.filter((c) => c.completed).length;

  const badges = SERVER_BADGES.map((b) => {
    const owningChallenge = SERVER_CHALLENGES.find((c) => c.badgeId === b.id);
    const isUnlocked = owningChallenge
      ? challenges.find((c) => c.id === owningChallenge.id)?.completed ?? false
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

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await verifySession(req);
  if (!user) {
    return res.status(401).json({ error: "Not signed in" });
  }

  // ---- GET: return current progress --------------------------------
  if (req.method === "GET") {
    try {
      const payload = await buildProgressPayload(user.id);
      return res.status(200).json(payload);
    } catch (err: any) {
      console.error("GET /api/challenges error:", err?.message);
      return res.status(500).json({ error: "Could not load progress" });
    }
  }

  // ---- POST: toggle a challenge ------------------------------------
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
    if (!challenge) {
      return res.status(400).json({ error: "Unknown challenge" });
    }

    // Look up existing row
    const { data: existing } = await supabase
      .from("challenge_progress")
      .select("id, completed")
      .eq("subscriber_id", user.id)
      .eq("challenge_id", challenge_id)
      .maybeSingle();

    // Upsert
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

    // Update streak: +1 on completion, -1 on un-completion (floor 0)
    const { data: sub } = await supabase
      .from("subscribers")
      .select("challenge_streak")
      .eq("id", user.id)
      .single();

    const currentStreak = sub?.challenge_streak ?? 0;

    // Only bump the streak when the state actually changed
    const actuallyChanged = (existing?.completed ?? false) !== completed;
    if (actuallyChanged) {
      const newStreak = completed
        ? Math.max(currentStreak + 1, 1)
        : Math.max(currentStreak - 1, 0);

      await supabase
        .from("subscribers")
        .update({ challenge_streak: newStreak })
        .eq("id", user.id);
    }

    // Return fresh payload
    const payload = await buildProgressPayload(user.id);
    return res.status(200).json({ success: true, ...payload });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
