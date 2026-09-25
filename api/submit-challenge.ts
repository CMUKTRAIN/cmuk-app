import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../server/lib/supabase.js";
import { resend } from "../server/lib/resend.js";
import { verifySession } from "../server/lib/verifySession.js";
import { getChallenge } from "../server/lib/challengeData.js";
import {
  generateAdminNotificationEmail,
  generateStudentConfirmationEmail,
} from "../server/lib/challengeEmailTemplates.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const ADMIN_EMAIL = "info@culinarymedicineuk.org";
const BUCKET = "challenge-proofs";

// ---------------------------------------------------------------------------
// Minimal multipart parser
// ---------------------------------------------------------------------------

interface ParsedForm {
  fields: Record<string, string>;
  file?: {
    fieldName: string;
    filename: string;
    contentType: string;
    buffer: Buffer;
  };
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BYTES + 512 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(body: Buffer, boundary: string): ParsedForm {
  const result: ParsedForm = { fields: {} };
  const boundaryBytes = Buffer.from(`--${boundary}`);
  const parts: Buffer[] = [];

  let start = body.indexOf(boundaryBytes);
  while (start !== -1) {
    const next = body.indexOf(boundaryBytes, start + boundaryBytes.length);
    if (next === -1) break;
    parts.push(body.slice(start + boundaryBytes.length, next));
    start = next;
  }

  for (const rawPart of parts) {
    let part = rawPart;
    if (part[0] === 0x0d && part[1] === 0x0a) part = part.slice(2);
    if (part.length === 0) continue;

    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headerText = part.slice(0, headerEnd).toString("utf8");
    const content = part.slice(headerEnd + 4);
    const trimmedContent =
      content.length >= 2 &&
      content[content.length - 2] === 0x0d &&
      content[content.length - 1] === 0x0a
        ? content.slice(0, -2)
        : content;

    const nameMatch = /name="([^"]+)"/.exec(headerText);
    const filenameMatch = /filename="([^"]*)"/.exec(headerText);
    const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);

    if (!nameMatch) continue;
    const fieldName = nameMatch[1];

    if (filenameMatch && filenameMatch[1]) {
      result.file = {
        fieldName,
        filename: filenameMatch[1],
        contentType: typeMatch ? typeMatch[1].trim() : "application/octet-stream",
        buffer: trimmedContent,
      };
    } else {
      result.fields[fieldName] = trimmedContent.toString("utf8");
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifySession(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });

  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!boundaryMatch) {
    return res.status(400).json({ error: "Expected multipart/form-data" });
  }
  const boundary = boundaryMatch[1] || boundaryMatch[2];

  let form: ParsedForm;
  try {
    const rawBody = await readRawBody(req);
    form = parseMultipart(rawBody, boundary);
  } catch (err: any) {
    console.error("Multipart parse error:", err?.message);
    return res.status(413).json({ error: "Upload too large or malformed" });
  }

  const { class_group, student_number, challenge_id } = form.fields;
  const file = form.file;

  if (!class_group?.trim() || !student_number?.trim() || !challenge_id?.trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (class_group.length > 60 || student_number.length > 40) {
    return res.status(400).json({ error: "Field too long" });
  }
  if (!file) return res.status(400).json({ error: "Photo is required" });
  if (!ALLOWED_MIME.includes(file.contentType)) {
    return res.status(400).json({ error: "Photo must be JPEG, PNG, WebP, or HEIC" });
  }
  if (file.buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: "Photo must be under 5 MB" });
  }

  const challenge = getChallenge(challenge_id);
  if (!challenge) return res.status(400).json({ error: "Unknown challenge" });

  // Duplicate check
  const { data: existing } = await supabase
    .from("challenge_submissions")
    .select("id")
    .eq("subscriber_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({
      error: "You've already submitted proof for this challenge.",
      entry_ref: existing.id.slice(0, 8),
    });
  }

  // Upload
  const ext = file.filename.split(".").pop()?.toLowerCase() || "jpg";
  const photoPath = `${user.id}/${challenge.id}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(photoPath, file.buffer, {
      contentType: file.contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message);
    return res.status(500).json({ error: "Could not store photo. Please try again." });
  }

  const submittedAt = new Date();

  // Insert submission row
  const { data: inserted, error: insertError } = await supabase
    .from("challenge_submissions")
    .insert({
      subscriber_id: user.id,
      student_email: user.email,
      first_name: user.first_name,
      class_group: class_group.trim(),
      student_number: student_number.trim(),
      challenge_id: challenge.id,
      challenge_title: challenge.title,
      challenge_week: challenge.week,
      photo_path: photoPath,
      submitted_at: submittedAt.toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("DB insert error:", insertError?.message);
    await supabase.storage.from(BUCKET).remove([photoPath]);
    return res.status(500).json({ error: "Could not record submission. Please try again." });
  }

  const entryRef = inserted.id.slice(0, 8);

  // ✅ Upsert challenge_progress — this is the "yes, submitting also ticks"
  const { data: existingProgress } = await supabase
    .from("challenge_progress")
    .select("completed")
    .eq("subscriber_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle();

  await supabase.from("challenge_progress").upsert(
    {
      subscriber_id: user.id,
      challenge_id: challenge.id,
      completed: true,
      completed_at: submittedAt.toISOString(),
      points_awarded: challenge.points,
      updated_at: submittedAt.toISOString(),
    },
    { onConflict: "subscriber_id,challenge_id" }
  );

  // Bump streak only if this was a fresh tick
  if (!existingProgress?.completed) {
    const { data: sub } = await supabase
      .from("subscribers")
      .select("challenge_streak")
      .eq("id", user.id)
      .single();
    const newStreak = Math.max((sub?.challenge_streak ?? 0) + 1, 1);
    await supabase
      .from("subscribers")
      .update({ challenge_streak: newStreak })
      .eq("id", user.id);
  }

  // Signed URL for admin email
  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(photoPath, 60 * 60 * 24 * 7);

  const photoSignedUrl = signed?.signedUrl ?? "(could not generate link)";

  // Admin email
  let adminEmailSent = false;
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: ADMIN_EMAIL,
      replyTo: user.email,
      subject: `Challenge proof: ${challenge.title} — ${user.first_name || user.email}`,
      html: generateAdminNotificationEmail({
        firstName: user.first_name,
        studentEmail: user.email,
        classGroup: class_group.trim(),
        studentNumber: student_number.trim(),
        challengeTitle: challenge.title,
        challengeWeek: challenge.week,
        entryRef,
        submittedAt,
        photoSignedUrl,
      }),
    });
    adminEmailSent = true;
  } catch (err: any) {
    console.error("Admin email error:", err?.message);
  }

  // Student confirmation email
  let studentEmailSent = false;
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: `Entry received: ${challenge.title} 🎉`,
      html: generateStudentConfirmationEmail({
        firstName: user.first_name,
        challengeTitle: challenge.title,
        challengeWeek: challenge.week,
        entryRef,
        submittedAt,
      }),
    });
    studentEmailSent = true;
  } catch (err: any) {
    console.error("Student email error:", err?.message);
  }

  await supabase
    .from("challenge_submissions")
    .update({
      admin_email_sent: adminEmailSent,
      student_email_sent: studentEmailSent,
    })
    .eq("id", inserted.id);

  return res.status(200).json({
    success: true,
    entry_ref: entryRef,
    challenge_id: challenge.id,
    message: "Entry received — check your email.",
  });
}
