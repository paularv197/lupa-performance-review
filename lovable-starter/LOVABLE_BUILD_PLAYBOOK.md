# Lupa People — Lovable build playbook

An ordered set of copy‑paste prompts for building the app in **Lovable**, from setup through the most complex parts. Paste them **one at a time**, in order, and let each finish before the next. For screen prompts, attach the matching Pencil frame's screenshot.

> **Stack note.** Lovable builds **Vite + React + TypeScript + Tailwind + shadcn/ui**, with a built‑in **Supabase** integration. The `lovable-starter/` folder in this repo is a *reference* (same tokens + primitives, expressed in Next.js) — the prompts below recreate the design system inside Lovable's own project. Don't try to import the Next.js app into Lovable.

## How to connect GitHub

Lovable's GitHub sync is two‑way on the project it generates:
1. Build a bit first (do **P0–P1** so there's something real), then in Lovable: **GitHub → Connect / Create repository**. Let Lovable create/sync a repo (e.g. `lupa-people-app`).
2. From then on, every Lovable change commits to that repo, and you can edit locally and it syncs back.
3. Keep *this* design repo (`lupa-performance-review`) as the source of truth for the `.pen` design + the three spec docs; the Lovable repo is the app.

---

## P0 — Project + design system

```
We're building "Lupa People", an internal people-ops web app for a ~50-person company (everyone is a contractor treated as a regular employee). Stack: Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase. Light mode only, English only, responsive.

First, set up the design system. It is fixed — use these exact tokens as CSS variables in the global stylesheet, and extend the Tailwind theme to reference them (never hardcode hex anywhere in the app):

:root {
  --background:#F5F5F5; --section:#F5F5F5; --card:#FFFFFF;
  --foreground:#2A2A2A; --body:#4A4A4A; --muted-foreground:#8A8A85;
  --border:#E7E7E3; --connector:#CFCFCA;
  --primary:#00483B; --primary-foreground:#FFFFFF; --primary-hover:#00352A; --primary-tint:#DCF1E9; --ring:#00483B;
  --status-approved-bg:#DCF1E9; --status-approved-fg:#0A5A46;
  --status-denied-bg:#FBE4E0;   --status-denied-fg:#A63A28;
  --status-info-bg:#B8DEFF;      --status-info-fg:#1E5C94;
  --status-pending-bg:#FFF4D4;   --status-pending-fg:#8A6A12;
  --status-neutral-bg:#EDEDEA;   --status-neutral-fg:#5A5A55;
  --status-ai-bg:#E8D3FF;        --status-ai-fg:#6B3FA0;
  --score-0-bg:#FBE4E0; --score-0-fg:#A63A28;
  --score-1-bg:#FFF4D4; --score-1-fg:#8A6A12;
  --score-2-bg:#E8F3D6; --score-2-fg:#4C6B1F;
  --score-3-bg:#DCF1E9; --score-3-fg:#0A5A46;
  --radius-input:6px; --radius-card:8px; --radius-dialog:12px; --radius-pill:999px;
}

Map these into Tailwind as: background, section, card, foreground, body, muted-foreground, border, connector, ring, primary (with .foreground/.hover/.tint), the status-*-bg/fg pairs, the score-*-bg/fg pairs, and radii input/card/dialog/pill. Set the default border color to var(--border).

Fonts: load Manrope (UI, this stands in for the brand face "Satoshi") as the default sans, and IBM Plex Mono for numbers/scores. Body text uses text-body on a bg-background surface.

Don't build any pages yet — just the tokens, Tailwind config, and fonts, then show me a simple page that renders swatches of every token so I can confirm the palette.
```

## P1 — Shared primitives

```
Create the shared UI primitives, styled only with the tokens. Reuse shadcn where it exists (Button, Card, Avatar, Input, Dialog, Select, Switch, Tabs, Table, Tooltip) and theme them with our tokens; add the custom ones:

- Button variants: primary (bg-primary/text-primary-foreground, hover bg-primary-hover), secondary (bg-status-neutral-bg), outline (border-border), ghost, destructive (bg-status-denied-fg). All rounded-pill, font-semibold, icon+label with gap-2, sizes sm/md. Icons: lucide-react.
- StatusPill: a small rounded-pill with an optional dot + label, tone = approved|info|pending|denied|neutral|ai (each maps to its status-*-bg/fg pair). The "ai" tone (violet) is reserved for AI/advisory.
- ScoreChip: a 0–3 review score in a 28px rounded-input chip using the score-N-bg/fg pair, number in font-mono.
- FunctionBadge (primary-tint pill) and TierBadge (outlined pill).
- Avatar: initials on a tinted circle (tones info/ai/approved/neutral), sizable.
- Field: label (text-body, 12px, semibold) above a control, optional helper (muted).
- AppShell + Sidebar + NavItem: fixed 248px white sidebar with a brand row, an "ME" section (My Profile, Time Off, My Reviews, Level Up) and a "COMPANY" section (Org Chart, People, Dashboards — admin only), and a user footer (avatar + name + role). NavItem active = bg-primary-tint + text-primary; default = text-body, hover bg-section. Main area scrolls, content padding p-8.

Show them all on a components page.
```

## P2 — Supabase, auth, roster schema, first RLS

```
Connect Supabase. Auth = Google Workspace SSO only (no email/password). On first sign-in, match the user to their roster record by work email; an email with no roster record is denied with a clear message.

Create the Phase 0 schema (single-org, no tenant_id):
- people: id, full_name, work_email (unique), photo_url, function_id, job_title_id, tier_id, manager_id (self-FK, solid line, nullable only for the CEO/root), base_role ('employee'|'admin'), status ('active'|'inactive'), start_date, address, date_of_birth, emergency_contact (jsonb), how_to_work_with_me (text), created_at.
- functions (id, name, head_person_id) — seed Recruiting Ops, Revenue Ops, Product Ops.
- job_titles (id, name); tiers (id, name) — seed Junior, Mid, Senior.
- dotted_line_managers (person_id, manager_id) — visibility only.
- activity_log (id, actor_id, action, target_type, target_id, payload jsonb, occurred_at) — append-only.
- notifications (id, recipient_id, type, body, link, read_at, created_at).

Roles: base_role is employee|admin. "Manager" is DERIVED — a person is a manager if ≥1 person has them as solid-line manager_id. Provide a helper (SQL function or view) is_manager(person_id) and is_manager_of(manager_id, employee_id) for solid-line only.

RLS (enable on every table; the UI is not the security boundary): everyone can read the basic roster fields needed for the org chart + overlap names (name, title, photo, function, manager). Everyone can edit only their OWN profile's optional fields. Admins can do anything. Sensitive tables (PTO, reviews — added later) will be default-deny with reads only along own / solid-line-direct-report / admin paths. Verify each policy.
```

## P3 — App shell wired to auth + roles

```
Wire the AppShell to the signed-in user: show their name/role in the footer, gate the "COMPANY → Dashboards" nav item (and later admin routes) to base_role='admin', and set up routing with a default landing route of "/" = My Profile for every role. Add a not-authorized state for gated routes. Keep everything on-brand with the primitives.
```

---

## P4 — Roster & config (Phase 0, admin)

```
Build the admin roster and config screens (match the attached Pencil frames "Screen / People" and "Screen / Config Lists"):
- People: searchable, filterable table (name+avatar, function badge, job title, tier badge, manager, status pill). "Add person" opens a form with all required fields (US-0.2). Row menu: edit, deactivate, reactivate, hard-delete (confirm dialog). Deactivate sets status='inactive' and preserves history. Every create/edit/deactivate/reactivate/delete writes to activity_log.
- Functions, titles & tiers: three editable lists with an "in use" count each; block deleting an item that's in use (US-0.3).
Enforce admin-only via RLS + route guard.
```

## P5 — My Profile home + Settings (Phase 0)

```
Build "My Profile" as the home page (US-0.5): tenure from start_date, live PTO balance (stub 0 for now), and a pending-tasks list (assessments/reviews/courses — stub for now). Then build "Settings" (match "Screen / Settings"): Personal information (name, last name, display name, job title + start date shown read-only/admin-managed, DOB, nationality, current location, and a rich-text "How to work with me"), Notifications (toggle rows persisted per user), Account (email read-only, change password is N/A under SSO — show a note). Only the person (and admins) can edit their profile.
```

## P6 — Org Chart (Phase 1)

```
Build the Org Chart (match "Screen / Org Tree"): render the reporting tree top-down from the root (manager_id is null). Node = photo + name + title. Solid edges = solid reporting; dotted-line relationships render visually distinct. Search-to-person is the only navigation (no filters/department views). Clicking a node opens that person's public profile (match "Screen / Profile — Diego") — public fields only, no PTO/reviews. Admin-only: a reporting-lines editor (match "Screen / Reporting Lines") to set solid + dotted managers; changes re-parent live and write to activity_log. Flag anyone (other than the root) with a null solid manager as unparented.
```

---

## P7 — PTO core (Phase 2)

```
Build PTO. Schema: pto_balances (person_id, balance_days in 0.5 steps); pto_requests (id, person_id, type 'PTO'|'UTO'|'HALF_FRIDAY', start_date, end_date, half_day_flag, window_id, business_days computed Mon–Fri excluding weekends/no holidays, deducts_balance bool = true for PTO / false for UTO+Half-Friday, status 'pending'|'approved'|'denied'|'cancelled', note, approver_id, decided_at); pto_request_changes (modify/cancel requests with restore_balance); pto_accrual_log (person_id, period, amount, source 'monthly'|'admin_adjustment', note).

Flows:
- Request (match "Screen / PTO Request"): pick type, dates, optional half-day, note; compute business days; show a live OVERLAP WARNING listing everyone else with overlapping approved/pending time off, by name, flagged "your team" vs "elsewhere" (company-wide names, but full request detail stays private).
- PTO deducts balance ON APPROVAL only; UTO/Half-Friday never touch the balance.
- Approval (manager): single step to the SOLID-LINE manager, with the same overlap warning; no self-approval (a manager-admin's own request routes to a different admin). In-app notification on submit + decision.
- Cancel/modify = a change request the manager approves, choosing restore-balance (default yes for PTO).
- Accrual: a scheduled job (pg_cron) grants +1.0 day on the 1st of each month to active people, logged; admins can set/adjust any balance with a note (match "Screen / PTO Balances").
RLS: employee sees own PTO; manager sees + approves solid-line direct reports; admin sees all. Overlap NAMES are visible company-wide; request detail is not.
```

## P8 — Half-Friday + who's out

```
Add Half-Friday (match "Screen / Admin — Half-Friday Windows" and "Screen / PTO Request — Half-Friday"): admins open a half_friday_windows row for a month (eligible Friday + label); employees request their half-Friday against an open window; it REQUIRES manager approval (coverage), is NON-DEDUCTING, and calendars on approval. Add a "Who's out" view for managers/admins (upcoming approved absences in scope). Optional: write approved PTO/half-Fridays to a shared Google Calendar via an Edge Function.
```

---

## P9 — Review frameworks (Phase 3, versioned) — getting complex

```
Build the two review frameworks (match "Screen / Company Culture Framework" and "Screen / Per Role Frameworks"). They share ONE editor.

Schema (versioned): culture_framework_versions (id, version_no, status, published_at) → culture_sections (id, version_id, name, order) → culture_competencies (id, section_id, name, definition, observable_behaviors text[], outcomes_impact, order; scored 0–3). Same shape for role_* but role_framework_versions carries a job_title_id.

Editor: Sections group Competencies; each competency expands to edit definition, an observable-behaviors bullet list, and outcomes/impact. A fixed 0–3 scale legend (0 Not yet, 1 Developing, 2 Proficient, 3 Role model). Per Role adds a job-title dropdown to choose which role's framework you're editing. A version banner shows the current version + "version history"; SAVING PUBLISHES A NEW VERSION — it never mutates existing versions. Admin-only (Per Role may also be editable by the function head / any manager per your rule).
```

## P10 — Taking reviews (self / manager / upward)

```
Build the review-taking flows. My Reviews hub (match "Screen / My Reviews"): an open-cycle banner + grouped tasks (self-assessment; upward review of my manager; manager reviews of my reports; results ready).

Scoring form (match "Screen / Review — Self-assessment" / "Manager review" / "Upward review"): a subject header, then the Company Culture framework block + the person's Per Role framework block. Each competency row = a 0–3 RADIO scale (0 Not yet → 3 Role model), a persistent note field, and an info icon whose TOOLTIP shows that competency's observable behaviors. Progress tracker; save draft / submit. A review stamps the framework VERSION in effect at creation.

Rules: self-assessment is HIDDEN from the manager until the manager finalizes theirs (US-3.10). Upward reviews are ANONYMOUS and only ever shown to the manager aggregated across their team (US-3.12). Store scores in self_assessment_scores / coaching_scores / upward_review_scores (dimension_ref, score, note).
```

## P11 — Review cycle engine (assemble + weighted scoring + gap view) — hard

```
Build the review cycle (match "Screen / Review Cycles" for setup/monitor, "Screen / Review — Results" for output).

review_cycles: id, name, window_start, window_end, culture_weight (default 0.60), role_weight (default 0.40), status 'draft'|'open'|'closed'. Admin launches with a window and an editable weight split; launching can fire the company-wide self-assessment and upward campaigns.

On close, the cycle ASSEMBLES signal without managers re-filling a form (US-3.14): the manager's contribution = their in-window coachings for that employee; plus the self-assessment (+ upward if run). Compute per employee: culture_avg and role_avg = simple averages of their 0–3 scores on each axis; overall = culture_avg*culture_weight + role_avg*role_weight. The SELF score is shown SIDE-BY-SIDE (gap view) and is NOT blended into overall. Persist review_scores (culture_avg, role_avg, weights, overall, self_culture_avg, self_role_avg) + per-dimension manager_score vs self_score.

Results screen: an overall score hero + axis breakdown, a per-competency Self-vs-Manager comparison (ScoreChips + an agreement/gap indicator), and the manager's written feedback. Results are hidden from the employee until an explicit RELEASE step. Cycle monitor: completion % by team, in-app nudges to laggards, reopen an individual review. RLS: employees see only their own RELEASED results.
```

## P12 — AI tier recommendation (Edge Function + Anthropic) — hard

```
After a cycle is scored, add an AI tier recommendation (US-3.15). Create a Supabase Edge Function that calls the Anthropic API (key in Supabase secrets — NEVER client-side) with the employee's cycle scores (both axes), current tier, and trend, and returns a suggested action (Keep in tier / Promote / Develop / Flag for PIP review) + a short rationale. Store on tier_recommendations. It is ADVISORY only — surfaced with the violet "ai" tone, never auto-applied, and comp is never touched. Show it on the admin's cycle result view with clear "AI suggestion" framing.
```

---

## P13 — Dashboards (Phase 4, managers/admins only)

```
Build the Dashboards (match "Screen / Dashboards"), visible to managers (their scope) and admins (all) — employees never see this. KPI tiles (headcount, out this week, cycle completion, avg culture score); Headcount & org shape (by function/tier/status as ranked bars); PTO (who's out this week, balances, a simple liability total); Review-cycle completion by team (bars, colour-coded by how far along); Score distribution across the Company Culture + Per role axes (0–3 counts, colour-matched to the score scale). On-screen only, no export.
```

---

## P14 — Onboarding: lessons + quiz builder (Phase 5)

```
Build the lesson library (match "Screen / Lessons", "New Lesson — Type/Video/Presentation/Text/Quiz"). lessons: id, title, type 'video'|'presentation'|'text'|'quiz', description, url (video/presentation embed), body (rich text; text lessons), est_minutes, cover_url, status 'draft'|'published', created_by. A "New lesson" type picker → the right editor: video/presentation take a URL (Loom/Jam/YouTube/Vimeo; Google Slides/Pitch/Canva/PDF) with a preview; text = a rich-text editor; quiz = a question builder.

quiz_questions: id, lesson_id, prompt, kind 'single'|'multi'|'open_written'|'open_video', options jsonb (with correct flags for select kinds), model_answer (open kinds), order; the quiz lesson has a pass_mark. Admin-only.
```

## P15 — Courses: day/week pacing + enrollment

```
Build courses (match "Screen / Courses", "New Course", "New Course — Add lessons", "Course — Manage", "Course — Enroll people").
courses: id, title, description, cover_url, cadence 'day'|'week', visibility, auto_enroll bool, status. course_lessons: course_id, lesson_id, period_no (which day/week), order — the number of distinct period_no = plan length.

Course builder: Details (title, description, an "auto-enroll new employees" toggle, visibility) + a Curriculum that's an explicit DAY/WEEK PLAN — a "Divide by day/week" dropdown, lessons grouped under Day/Week N, "Add lessons" pulls from the library. No due date here.

Enrollment happens AFTER publishing: enroll by individual, function/team, or everyone; auto_enroll adds new hires as they join the roster. enrollments: course_id, person_id, source 'manual'|'auto', enrolled_at, due_at (COMPUTED = enrolled_at + plan length), status, completed_at. Manage view: stat tiles, an "In progress" table with a PACE FLAG (on-track / behind by N days vs the person's schedule) and a "Completed" table (finish date + quiz score).
```

## P16 — Level Up learner + lesson players

```
Build the learner experience (match "Screen / Level Up", "Level Up — Course", and the four "Lesson — *" players). Level Up home groups assigned courses in-progress / not-started / completed with progress, a pace pill, and a due date. Opening a course shows its day-by-day (or week-by-week) plan with completed / current / locked lessons and "continue where I left off". Lesson players: play the video/slides embed, render the text, or take the quiz (select answers, type a written response, or record/upload a video); a right-hand course outline; "mark complete & continue" advances progress and recomputes pace. lesson_progress: enrollment_id, lesson_id, status, completed_at, quiz_score.
```

## P17 — AI answer grading (Edge Function) — hard

```
For quiz open questions, grade against the model answer with AI (US-5.3). Add a Supabase Edge Function (Anthropic API, key in secrets) that compares a learner's written response — or a video response's transcript — to the question's model_answer and returns a pass/needs-review + a short reason; uncertain results are flagged for a person to review. Advisory (violet "ai" tone). Store the result on the attempt and surface it in the admin manage view.
```

---

## P18 — Cross-cutting: notifications + activity log

```
Wire the cross-cutting pieces end to end: (1) In-app notifications via a notifications table + Supabase Realtime — ping on PTO submit/decision, assigned assessments, review release, nudges, course assigned, course completed; a bell with unread state. (2) Ensure every sensitive action already writes to activity_log (PTO approve/deny, review release, role/reporting-line changes, deactivate/reactivate/delete) and build the admin Activity Log view (match "Screen / Activity Log") with filters. Re-verify RLS across all tables: default-deny on PTO + reviews, reads only along own / solid-line-direct-report / admin paths.
```

---

## Working tips

- **One prompt at a time**, and after each, click through the result before moving on — walk the "definition of done" for that slice in `lupa_people_roadmap.md`.
- **Attach the Pencil screenshot** with each screen prompt; tell Lovable "match this layout exactly, use the existing primitives, tokens only."
- **RLS after each data slice**, not at the end: ask Lovable to write and TEST the policies per table (own / direct-report / admin).
- If Lovable drifts off-brand, re-paste the P0 token block and say "use these tokens, no hardcoded colors."
- Keep secrets (Anthropic key, Google creds) in **Supabase secrets**, only called from Edge Functions.
