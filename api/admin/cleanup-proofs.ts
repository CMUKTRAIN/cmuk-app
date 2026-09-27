import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../server/lib/supabase.js";
import { requireAdmin } from "../_lib/adminAuth.js";

const BUCKET = "challenge-proofs";
const DEFAULT_AGE_DAYS = 30;

interface Body {
  age_days?: number;
  dry_run?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await requireAdmin(req);
  if ("error" in auth) return res.status(auth.status).json({ error: auth.error });

  const body: Body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const ageDays = Number.isFinite(body.age_days)
    ? Math.max(1, Number(body.age_days))
    : DEFAULT_AGE_DAYS;
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
    return res.status(500).json({
      error: "Photos deleted, but DB rows failed to delete",
      deleted_photos: paths.length,
      deleted_rows: 0,
    });
  }

  return res.status(200).json({
    dry_run: false,
    age_days: ageDays,
    deleted_count: candidates.length,
    deleted_photos: paths.length,
    deleted_rows: ids.length,
  });
}
