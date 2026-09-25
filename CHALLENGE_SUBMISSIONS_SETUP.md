# Challenge Submissions + Server-Side Progress — Setup

## 1. Supabase — run the migration

Open Supabase → SQL Editor → paste `supabase/migrations/20260925_challenge_progress_and_submissions.sql` → Run.

This creates:
- `subscribers.challenge_streak` column
- `challenge_progress` table
- `challenge_submissions` table
- `challenge-proofs` storage bucket (private, 5 MB)

If the storage bucket insert errors on your plan, create it manually in
Storage → New Bucket:
- Name: `challenge-proofs`
- Public: OFF
- File size limit: 5 MB
- Allowed MIME: image/jpeg, image/png, image/webp, image/heic

## 2. Verify subscribers columns

Confirm `subscribers` has:
- `session_token` text
- `session_expires_at` timestamptz

(Already used by `/api/me` and `/api/confirm`.)

## 3. Vercel — no new env vars

Existing vars are sufficient:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `VITE_APP_URL`

## 4. Deploy

Push to GitHub → Vercel auto-deploys.

New endpoints live at:
- `GET  /api/challenges`            — fetch progress
- `POST /api/challenges`            — toggle a challenge
- `POST /api/challenges/migrate`    — one-time local → server migration
- `POST /api/submit-challenge`      — photo proof submission
- `POST /api/notify-badge`          — badge-unlocked email

## 5. Behaviour after 30-day session expiry

- Session cookie dies → student signs in again via magic link
- On app load, `/api/challenges` fetches their progress **from the server**
- Progress is now **device-independent**: phone, laptop, library PC all show the same state
- localStorage acts only as a fallback if the network is down

## 6. One-time migration for existing students

On first authenticated load after deploy:
1. Client reads localStorage
2. If server has zero completed challenges AND local has some completed
3. Client POSTs to `/api/challenges/migrate`
4. Server inserts `challenge_progress` rows

Safe to run repeatedly — server skips if it already has progress.

## 7. Testing checklist

- [ ] Sign in as a student
- [ ] Complete Week 1 by clicking the card → row appears in `challenge_progress`
- [ ] Reload → state persists
- [ ] Sign out, sign in again → state still persists
- [ ] Clear cookies + sign in again → state STILL persists (this is the whole point)
- [ ] Sign in on a different device → same progress
- [ ] Open Week 2 → submit a photo → confirm:
  - [ ] Row in `challenge_submissions`
  - [ ] Row in `challenge_progress` (auto-ticked)
  - [ ] Admin email arrives with signed link
  - [ ] Student confirmation email arrives
  - [ ] Badge email arrives
- [ ] Try submitting Week 2 again → expect 409, friendly message

## 8. Inspecting submissions

Supabase → Table Editor → `challenge_submissions`
- Sort by `submitted_at DESC`
- Filter by `challenge_id`
- `admin_email_sent = false` or `student_email_sent = false` → check Vercel logs

Photos: Supabase → Storage → `challenge-proofs` → folders are `{subscriber_id}/`

## 9. Known limitations

- **Streak is a simple counter**, not a real calendar-day streak. It increments on each completion and decrements on un-completion (floor 0). A real streak would compute from `completed_at` timestamps — future work.
- **Multipart parser is hand-rolled.** Test with real phone photos. If anything fails, swap for `formidable`.
- **No admin UI yet.** Submissions live in email + Supabase dashboard.
