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
  const dryRun = body.dry_run !== false; // default true for safety
