const HEADER_BG = "#f29007";
const BRAND_GREEN = "#1A3C34";
const CTA_ORANGE = "#E45B10";
const APP_URL = "https://app.culinarymedicineuk.training";
const LOGO_URL = "https://app.culinarymedicineuk.training/EmailIcon.png";

function shell(bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CMUK</title>
    </head>
    <body style="background-color: #f8f9fa; margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <tr>
          <td style="background: ${HEADER_BG}; padding: 30px 40px; text-align: center;">
            <img src="${LOGO_URL}" alt="Culinary Medicine UK" style="max-height: 60px; margin-bottom: 8px;" />
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Fuel Your Future</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; color: #1a1a1a; line-height: 1.6;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 40px; background: #f8f9fa; text-align: center; font-size: 14px; color: #888; border-top: 1px solid #eaeaea;">
            <p style="margin: 0 0 8px 0;">
              <a href="https://culinarymedicineuk.training" style="color: ${CTA_ORANGE}; text-decoration: none;">Culinary Medicine UK</a>
            </p>
            <p style="margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Culinary Medicine UK. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ---------------------------------------------------------------------------
// Admin notification (submission received, awaiting review)
// ---------------------------------------------------------------------------
export interface AdminNotificationParams {
  firstName: string | null;
  studentEmail: string;
  classGroup: string;
  studentNumber: string;
  challengeTitle: string;
  challengeWeek: number;
  entryRef: string;
  submittedAt: Date;
  photoSignedUrl: string;
}

export function generateAdminNotificationEmail(p: AdminNotificationParams): string {
  const submittedLondon = p.submittedAt.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "full",
    timeStyle: "short",
  });
  const studentName = p.firstName?.trim() || "(no first name on record)";

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8f9fa; padding: 20px; margin: 0; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background: #FFF4ED; border-left: 4px solid ${CTA_ORANGE}; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: 700; color: ${BRAND_GREEN};">⏳ Awaiting review</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">Approve or reject from the admin portal.</p>
        </div>

        <h2 style="color: ${BRAND_GREEN}; margin: 0 0 20px 0; font-size: 20px;">New challenge submission</h2>

        <table cellpadding="0" cellspacing="0" style="font-size: 15px; line-height: 1.7; width: 100%;">
          <tr><td style="padding: 4px 12px 4px 0; color: #666; width: 150px;">Student</td><td style="padding: 4px 0; font-weight: 600;">${studentName}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Email</td><td style="padding: 4px 0;"><a href="mailto:${p.studentEmail}" style="color: ${CTA_ORANGE}; text-decoration: none;">${p.studentEmail}</a></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Class group</td><td style="padding: 4px 0;">${p.classGroup}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Student number</td><td style="padding: 4px 0;">${p.studentNumber}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Challenge</td><td style="padding: 4px 0; font-weight: 600;">${p.challengeTitle} <span style="color: #888; font-weight: 400;">(Week ${p.challengeWeek})</span></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Submitted</td><td style="padding: 4px 0;">${submittedLondon}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #666;">Entry ref</td><td style="padding: 4px 0; font-family: monospace; font-size: 14px;">${p.entryRef}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #FFF4ED; border-left: 4px solid ${CTA_ORANGE}; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: ${BRAND_GREEN};">Photo proof</p>
          <p style="margin: 0; font-size: 14px; color: #4a4a4a;">
            <a href="${p.photoSignedUrl}" style="color: ${CTA_ORANGE}; text-decoration: none;">Open photo →</a>
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">Signed link expires in 7 days.</p>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="${APP_URL}/admin" style="display: inline-block; background: ${CTA_ORANGE}; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Review in admin portal →
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ---------------------------------------------------------------------------
// Approval email — sent when admin approves
// ---------------------------------------------------------------------------
export interface ApprovalEmailParams {
  firstName: string | null;
  challengeTitle: string;
  challengeWeek: number;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  pointsEarned: number;
  userPoints: number;
}

export function generateApprovalEmail(p: ApprovalEmailParams): string {
  const name = p.firstName?.trim() || "there";

  const body = `
    <h2 style="color: ${BRAND_GREEN}; font-size: 20px; margin-top: 0;">Nice work, ${name}! 🎉</h2>

    <p style="font-size: 16px; color: #4a4a4a;">
      Your photo for <strong>${p.challengeTitle}</strong> (Week ${p.challengeWeek}) has been approved. Your badge is unlocked.
    </p>

    <div style="background: #FFF4ED; border-left: 4px solid ${CTA_ORANGE}; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
      <div style="font-size: 48px; line-height: 1; margin-bottom: 8px;">${p.badgeIcon}</div>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${BRAND_GREEN};">${p.badgeName}</p>
      <p style="margin: 6px 0 0 0; font-size: 14px; color: #666;">${p.badgeDescription}</p>
    </div>

    <table cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.9; color: #4a4a4a; margin: 0 auto;">
      <tr><td style="padding: 2px 12px 2px 0; color: #888;">Points earned</td><td style="padding: 2px 0; font-weight: 700;">+${p.pointsEarned}</td></tr>
      <tr><td style="padding: 2px 12px 2px 0; color: #888;">Total points</td><td style="padding: 2px 0; font-weight: 700;">${p.userPoints} pts</td></tr>
    </table>

    <div style="text-align: center; margin: 28px 0 12px;">
      <a href="${APP_URL}" style="display: inline-block; background: ${CTA_ORANGE}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
        View your challenges →
      </a>
    </div>

    <p style="margin-top: 24px; font-weight: 600; color: ${BRAND_GREEN};">Eat Better • Feel Better • Learn Better • Work Better</p>
    <p style="font-size: 16px; color: #4a4a4a; margin-top: 8px;">— The CMUK Team</p>
  `;
  return shell(body);
}

// ---------------------------------------------------------------------------
// Rejection email — sent when admin rejects
// ---------------------------------------------------------------------------
export interface RejectionEmailParams {
  firstName: string | null;
  challengeTitle: string;
  challengeWeek: number;
}

export function generateRejectionEmail(p: RejectionEmailParams): string {
  const name = p.firstName?.trim() || "there";

  const body = `
    <h2 style="color: ${BRAND_GREEN}; font-size: 20px; margin-top: 0;">Hi ${name},</h2>

    <p style="font-size: 16px; color: #4a4a4a;">
      Thanks for submitting your photo for <strong>${p.challengeTitle}</strong> (Week ${p.challengeWeek}).
    </p>

    <p style="font-size: 16px; color: #4a4a4a;">
      When we looked at your photo, it didn't quite match this challenge. This often happens with:
    </p>

    <ul style="font-size: 15px; color: #4a4a4a; line-height: 1.9; padding-left: 20px;">
      <li>Photos of a different subject or location</li>
      <li>Blurry or unclear images</li>
      <li>Photos taken from the internet instead of a real attempt</li>
    </ul>

    <p style="font-size: 15px; color: #4a4a4a;">
      You can try again anytime — just open the challenge and upload a new photo.
    </p>

    <div style="text-align: center; margin: 28px 0 12px;">
      <a href="${APP_URL}" style="display: inline-block; background: ${CTA_ORANGE}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
        Retry this challenge →
      </a>
    </div>

    <p style="font-size: 14px; color: #888; margin-top: 12px;">Questions? Just reply to this email.</p>

    <p style="margin-top: 24px; font-weight: 600; color: ${BRAND_GREEN};">Eat Better • Feel Better • Learn Better • Work Better</p>
    <p style="font-size: 16px; color: #4a4a4a; margin-top: 8px;">— The CMUK Team</p>
  `;
  return shell(body);
}
