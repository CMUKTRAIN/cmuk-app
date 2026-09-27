import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../server/lib/supabase.js";

const BUCKET = "challenge-proofs";
const HARD_DELETE_DAYS = 39;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers["authorization"];
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET not set");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (authHeader !== expected) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  const cutoffIso = new Date(
    Date.now() - HARD_DELETE_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: rows, error: fetchError } = await supabase
    .from("challenge_submissions")
    .select("id, photo_path")
    .lt("submitted_at", cutoffIso);

  if (fetchError) {
    console.error("Cron cleanup fetch error:", fetchError.message);
    return res.status(500).json({ error: "Could not fetch submissions" });
  }

  const candidates = rows ?? [];
  if (candidates.length === 0) {
    return res.status(200).json({
      deleted_count: 0,
      cutoff_iso: cutoffIso,
      message: "Nothing to delete.",
    });
  }

  const paths = candidates.map((r) => r.photo_path);
  const ids = candidates.map((r) => r.id);

  const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
  if (storageError) {
    console.error("Cron storage delete error:", storageError.message);
    return res.status(500).json({ error: "Storage delete failed" });
  }

  const { error: dbError } = await supabase
    .from("challenge_submissions")
    .delete()
    .in("id", ids);

  if (dbError) {
    console.error("Cron DB delete error:", dbError.message);
    return res.status(500).json({ error: "DB delete failed", deleted_photos: paths.length });
  }

  return res.status(200).json({
    deleted_count: candidates.length,
    deleted_photos: paths.length,
    deleted_rows: ids.length,
    cutoff_iso: cutoffIso,
  });
}
