import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../server/lib/supabase.js";
import { verifySession } from "../../server/lib/verifySession.js";
import { SERVER_CHALLENGES, getChallenge } from "../../server/lib/challengeData.js";

interface MigrateBody {
  completed_challenge_ids?: string[];
  streak_days?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifySession(req);
  if (!user) {
    return res.status(401).json({ error: "Not signed in" });
  }

  const body: MigrateBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

  const incomingIds = Array.isArray(body.completed_challenge_ids)
    ? body.completed_challenge_ids.filter((id) => typeof id === "string")
    : [];

  // 1. Read current server state
  const { data: existingRows } = await supabase
    .from("challenge_progress")
    .select("challenge_id, completed")
    .eq("subscriber_id", user.id);

  const serverCompletedIds = new Set(
    (existingRows ?? []).filter((r) => r.completed).map((r) => r.challenge_id)
  );

  // 2. Idempotency: if server already has any completed rows, skip migration.
  //    This prevents clobbering server state on subsequent logins.
  if (serverCompletedIds.size > 0) {
    return res.status(200).json({
      migrated: false,
      reason: "Server already has progress — migration skipped.",
      server_completed_ids: Array.from(serverCompletedIds),
    });
  }

  if (incomingIds.length === 0) {
    return res.status(200).json({
      migrated: false,
      reason: "No local progress to migrate.",
    });
  }

  // 3. Validate & insert one row per known challenge
  const validIds = incomingIds.filter((id) => getChallenge(id) !== null);

  if (validIds.length === 0) {
    return res.status(200).json({
      migrated: false,
      reason: "No recognised challenge IDs in payload.",
    });
  }

  const now = new Date().toISOString();

  const rows = validIds.map((id) => {
    const c = SERVER_CHALLENGES.find((x) => x.id === id)!;
    return {
      subscriber_id: user.id,
      challenge_id: c.id,
      completed: true,
      completed_at: now,
      points_awarded: c.points,
      updated_at: now,
    };
  });

  const { error: insertError } = await supabase
    .from("challenge_progress")
    .upsert(rows, { onConflict: "subscriber_id,challenge_id" });

  if (insertError) {
    console.error("Migration insert error:", insertError.message);
    return res.status(500).json({ error: "Migration failed" });
  }

  // 4. Migrate streak if local was higher than server's
  const incomingStreak = Number.isFinite(body.streak_days)
    ? Math.max(0, Number(body.streak_days))
    : 0;

  const { data: sub } = await supabase
    .from("subscribers")
    .select("challenge_streak")
    .eq("id", user.id)
    .single();

  const serverStreak = sub?.challenge_streak ?? 0;

  if (incomingStreak > serverStreak) {
    await supabase
      .from("subscribers")
      .update({ challenge_streak: incomingStreak })
      .eq("id", user.id);
  }

  return res.status(200).json({
    migrated: true,
    migrated_count: rows.length,
    migrated_ids: validIds,
  });
}
