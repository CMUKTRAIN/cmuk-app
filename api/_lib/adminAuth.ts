import type { VercelRequest } from "@vercel/node";
import { verifySession, SessionUser } from "../../server/lib/verifySession.js";

const DEFAULT_ADMINS = [
  "ux8@me.com",
  "sumi@culinarymedicineuk.org",
  "vince@culinarymedicineuk.org",
];

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return DEFAULT_ADMINS;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(
  req: VercelRequest
): Promise<{ user: SessionUser } | { error: string; status: number }> {
  const user = await verifySession(req);
  if (!user) return { error: "Not signed in", status: 401 };

  const admins = getAdminEmails();
  if (!admins.includes(user.email.toLowerCase())) {
    return { error: "Not authorised", status: 403 };
  }

  return { user };
}
