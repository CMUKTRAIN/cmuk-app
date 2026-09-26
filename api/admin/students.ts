import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../server/lib/supabase.js";
import { requireAdmin } from "../_lib/adminAuth.js";
import { SERVER_CHALLENGES } from "../../server/lib/challengeData.js";

const BUCKET = "challenge-proofs";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 4; // 4 hours

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await requireAdmin(req);
  if ("error" in auth) return res.status(auth.status).json({ error: auth.error });

  // Fetch all submissions with subscriber email + first_name
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

  // Batch sign all photos
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

  // Group by student email
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
      byStudent.set(key, {
        email: r.student_email,
        first_name: r.first_name,
        submissions: [],
      });
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
