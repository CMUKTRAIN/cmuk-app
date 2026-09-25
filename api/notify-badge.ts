import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";
import { resend } from "../server/lib/resend.js";
import { verifySession } from "../server/lib/verifySession.js";
import {
  getChallenge,
  getBadge,
  SERVER_CHALLENGES,
  getBadgesRemaining,
} from "../server/lib/challengeData.js";
import { generateBadgeEmail } from "../server/lib/challengeEmailTemplates.js";

interface Body {
  challenge_id?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifySession(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });

  const body: Body =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const { challenge_id } = body;

  if (!challenge_id || typeof challenge_id !== "string") {
    return res.status(400).json({ error: "challenge_id is required" });
  }

  const challenge = getChallenge(challenge_id);
  if (!challenge) return res.status(400).json({ error: "Unknown challenge" });

  const badge = getBadge(challenge.badgeId);
  if (!badge) return res.status(500).json({ error: "Badge mapping missing" });

  // Read authoritative progress from DB
  const { data: rows } = await supabase
    .from("challenge_progress")
    .select("challenge_id, completed")
    .eq("subscriber_id", user.id);

  const completedIds = new Set(
    (rows ?? []).filter((r) => r.completed).map((r) => r.challenge_id)
  );

  const userPoints = SERVER_CHALLENGES
    .filter((c) => completedIds.has(c.id))
    .reduce((sum, c) => sum + c.points, 0);

  const badgesRemaining = getBadgesRemaining(userPoints, completedIds.size);

  const { data: sub } = await supabase
    .from("subscribers")
    .select("challenge_streak")
    .eq("id", user.id)
    .single();

  const streakDays = sub?.challenge_streak ?? 0;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: `Badge unlocked: ${badge.name} 🏆`,
      html: generateBadgeEmail({
        firstName: user.first_name,
        badgeName: badge.name,
        badgeDescription: badge.description,
        badgeIcon: badge.icon,
        badgeAccentColor: badge.accentColor,
        pointsEarned: challenge.points,
        userPoints,
        streakDays,
        badgesRemaining,
      }),
    });
  } catch (err: any) {
    console.error("Badge email error:", err?.message);
    return res.status(500).json({ error: "Could not send badge email" });
  }

  return res.status(200).json({ success: true });
}
