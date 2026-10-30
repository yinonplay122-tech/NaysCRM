# Naya CRM Cloud — SaaS foundation

A **development scaffold**, not a deployed or production-ready product. Includes real Supabase email/password auth, agency onboarding, tenant-scoped creator/fan CRUD, a Hebrew RTL dashboard, PostgreSQL schema, RLS and role primitives. No actual OnlyFans connection, message sending, AI or payments.

## Start
1. Create a Supabase project. Enable email auth and configure redirect/site URL for your domain.
2. Run `supabase/migrations/001_initial.sql` in Supabase SQL Editor on an empty project.
3. Copy `.env.example` to `.env.local` and fill your Supabase URL and **publishable/anon** key. Never put the service role key in `NEXT_PUBLIC_*`.
4. Run `npm install && npm run dev` and open `http://localhost:3000`.
5. Register, verify email if enabled, log in, create an agency, add a creator and fan.
6. Deploy to Vercel or your own Node host with HTTPS and configure production env vars.

## Security / launch blockers
- Do **not** store actual customer data until a security review, privacy notices, lawful processing basis, data deletion/export controls, backups, rate limits, abuse monitoring, secure error handling, and integration compliance are completed.
- Implement **server-side invitation workflow** for membership creation and role changes, plus creator-level access scopes and audited privileged writes. The schema currently intentionally prevents client-side membership changes.
- Add RLS integration tests with at least two distinct authenticated users/agencies. Test cross-tenant reads, inserts, updates, and forged creator/fan relationships. The database has composite foreign keys to block cross-tenant record references.
- Add MFA for privileged roles, session management, monitoring, incident response, consent and retention policies, GDPR/other applicable privacy compliance, and content access controls.
- Revenue totals must be imported from a verified permitted source; no fabricated financial metrics.
- Only connect to third-party platforms through authorized integrations; do not request creator passwords or bypass platform restrictions.
- Current app selects first agency membership; implement a tenant switcher and finer-grained authorization before commercial rollout.

## Roadmap
1. Team invitation service, RBAC admin UI, MFA and tenant switcher.
2. Creators/fans details, notes, tags, segmentation, saved filters, CSV import/export with validation.
3. Conversation inbox via supported integrations, internal notes, assignment and templates.
4. Campaign analytics, tracked links, commission rules, financial reconciliation.
5. Background jobs, idempotency, event/webhook processing, AI with opt-in and human review.
6. Billing, student/course entitlement, super-admin support tooling, audit/backup/restore and production hardening.

This is an independent implementation and not affiliated with OnlyMonster.

## Multi-tenant web deployment (phase 2)
1. Apply `supabase/migrations/001_initial.sql` then `002_invites.sql` in Supabase SQL Editor.
2. Configure verified email signup in Supabase Auth. Each student signs up, confirms email, creates an agency, and can invite existing verified users.
3. Deploy the repository to Vercel; set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables (never expose a service-role key).
4. In Supabase Auth configure the production Site URL and approved redirect URLs.
5. Test two independent accounts and agencies before any real data. Test RLS isolation, invitation expiry, unauthorized mutation and cross-tenant IDs.

**Limitations:** This is a starter, not a production-ready system. Invitation creation does not send email; recipient signs up and clicks 'קבלת הזמנות'. Agency switching uses links. Creator-level chatter restrictions, super-admin dashboard, subscriptions, billing, verified platform integrations, rate limits, automated backups, audit event pipeline, and security penetration testing are not implemented. Existing baseline RLS lets all agency members read all agency data; restrict by creator assignment before inviting chatters to sensitive live data. Do not import real personal data until access policies are hardened and tested.

## Web SaaS v2
Apply `002_invites.sql` after `001_initial.sql`. Deploy with Vercel and configure Supabase environment variables and Auth production URLs. Students register and create agencies; owners can invite verified registered users by email, who accept from dashboard. Invitation creation does not send email automatically. Agency switching is via dashboard links.

**Security warning:** Existing tenant RLS allows any agency member to read agency-wide data, including chatter roles. Do not import sensitive real customer data or onboard external workers before implementing creator-level assignment RLS, security testing, email delivery, billing, super-admin console and operational controls. This is a development starter, not a production deployment.


## תיקון שלב 7 — התחברות אחרי אימות אימייל
- ב-Vercel → Settings → Environment Variables הוסף `NEXT_PUBLIC_SITE_URL` עם כתובת האתר המלאה, לדוגמה `https://naya-crm-cloud.vercel.app` (בלי `/` בסוף).
- ב-Supabase → Authentication → URL Configuration הגדר Site URL לכתובת האתר, והוסף Redirect URL מדויק: `https://YOUR-DEPLOYMENT.vercel.app/auth/callback`.
- השתמש בגרסה המעודכנת של הקוד; העלה אותה ל-GitHub והפעל Redeploy ב-Vercel.
- בדוק את הסטטוס ב-Vercel → Deployments. אם מופיע Error, היכנס ל-Build Logs ולאחר מכן שלח את הודעת השגיאה (ללא מפתחות וסיסמאות).
- חשוב: לא ניתן לקבוע מה התקלה הספציפית בלי הודעת השגיאה. אם אימות המייל אצלך משתמש ב-`token_hash` במקום ב-`code`, צריך להתאים את תבנית המייל או את נקודת האימות.
