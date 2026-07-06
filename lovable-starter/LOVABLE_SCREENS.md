# Lupa People — per-screen build prompts

One prompt per screen, in ship order. For each, **attach the matching Pencil frame's screenshot** as the visual reference, reuse the primitives, and wire the functionality from the referenced user story. Frame IDs refer to `lupa-performance-review.pen`.

> Convention for every prompt: "Use `AppShell`; reuse existing primitives; tokens only (no hex); match the attached frame; enforce the RLS/permissions from the master prompt."

---

## Foundations & Profile

**My Profile (home)** — frame `Screen / My Profile` · US-0.5, US-0.4
Default landing for every role. Show tenure (from start_date), live PTO balance, and a pending-tasks list (assessments/reviews to do, courses assigned). Read-only structural fields; edit own profile fields.

**Personal Settings** — frame `Screen / Settings` (tVnXJ) · US-0.4
Three cards: **Personal information** (name, last name, display name, job title, start date, DOB, nationality, current location, and a rich-text "How to work with me"), **Notifications** (toggle rows), **Account** (email read-only, change password). Job title/start date are admin-managed (read-only to the employee).

**Company Settings hub** — frame `Screen / Company Settings` (chrgD) · admin only
A grid of navigable setting cards grouped by domain: People/Org (People, Functions·titles·tiers, Reporting lines), Time Off (Half-Friday windows, PTO balances), Onboarding (Lessons, Courses), Reviews (Company Culture Framework, Per Role Frameworks, Review cycles), System (Activity log, Notifications). Each card routes to its screen.

---

## Org Chart *(Phase 1)*

**Org tree** — frame `Screen / Org Tree` (Y8bQX) · US-1.1, 1.2, 1.3
Top-down tree from the root (CEO, no manager). Node = photo + name + title. Solid edges = reporting; dotted-line edges visually distinct. Search-to-person is the only nav. Click a node → profile. Admins can re-parent.

**Profile (from chart)** — frame `Screen / Profile — Diego` (ehmoc) · US-1.4
Public profile: avatar, name, title, function/tier, tenure, "How to work with me". No PTO/review data here.

**Reporting lines editor** — frame `Screen / Reporting Lines` (jTnNn) · US-1.5
Admin table: each person → solid-line manager (select) + dotted-line managers (chips + add). Changes write to the activity log.

---

## PTO *(Phase 2)*

**My PTO** — frame `Screen / My PTO` (YUlt4) · US-2.1, 2.6
Balance pill, request button, list of my requests with status pills, upcoming approved time.

**PTO request** — frame `Screen / PTO Request` (UOH4m) · US-2.1–2.4
Drawer: type (PTO/UTO/Half-Friday), dates, optional half-day, note. Compute business days (Mon–Fri). Live **overlap warning** listing others off on those dates, by name, flagged "your team" vs "elsewhere".

**Half-Friday request** — frame `Screen / PTO Request — Half-Friday` (dxbRV) · US-2.10
Request against an open monthly window; requires manager approval; non-deducting; overlap warning.

**Admin — Half-Friday windows** — frame `Screen / Admin — Half-Friday Windows` (xYx7D) · US-2.9
Admin opens a half-Friday window for a month (eligible Friday + label). Does not auto-grant.

**PTO balances (admin)** — frame `Screen / PTO Balances` (FXZ4R) · US-2.7
Table of people with accrued/used/balance + an adjust panel (set / add / subtract + reason; logged distinctly from accrual).

**Approvals (manager)** — (build to match ApprovalCard) · US-2.5, 2.8
Manager sees pending requests with the same overlap warning; approve/deny; on cancel/modify, choose restore-balance (default yes for PTO). Single-step to the solid-line manager; no self-approval.

---

## Admin config

**People / Roster** — frame `Screen / People` (jr5c2) · US-0.2, 0.6
Searchable/filterable table (name, function, title, tier, manager, status). Add person (all required fields). Row actions: edit, deactivate, reactivate, hard-delete (confirm). All write to the activity log.

**Functions, titles & tiers** — frame `Screen / Config Lists` (BVJbU) · US-0.3
Three editable lists with "in use" counts; an in-use item can't be deleted (block or reassign).

**Activity log** — frame `Screen / Activity Log` (xBwEY) · US-X.3
Append-only audit trail with filters (actor, type, date) and typed events. Admin-readable.

**Notification defaults** — frame `Screen / Notification Defaults` (CEFcC) · US-X.2
Grouped categories (Time Off, Reviews, Onboarding, System) with in-app / email toggles.

---

## Reviews *(Phase 3)*

**Company Culture Framework builder** — frame `Screen / Company Culture Framework` (zUNzW) · US-3.1, 3.2
Sections → Competencies; each competency has name, definition, observable behaviors (list), outcomes/impact; scored 0–3. Accordion editor. Version banner ("Version N · Published …", "Version history"); saving publishes a new version applied to future reviews only.

**Per Role Frameworks builder** — frame `Screen / Per Role Frameworks` (GWBhe) · US-3.3
Same editor as Company Culture, plus a **job-title dropdown** to pick which role's framework to edit. Versioned per role.

**Review cycles** — frame `Screen / Review Cycles` (KLJhP) · US-3.13, 3.17
Active cycle card: window, weight split (default 60% Company Culture / 40% Per role), completion by stage. Past cycles. New cycle (launch fires self/upward campaigns).

**My Reviews (hub)** — frame `Screen / My Reviews` (JPMQI) · US-3.9–3.11
Open-cycle banner + grouped tasks: self-assessment (about you), reviews to give (upward of your manager, manager reviews of reports), and results ready to view.

**Self-assessment** — frame `Screen / Review — Self-assessment` (bW09k) · US-3.10
Score yourself against Company Culture (60%) + your Per Role framework (40%). Each competency: 0–3 **radio** scale, a persistent note field, and an info tooltip showing observable behaviors. Progress tracker; save draft / submit. Hidden from your manager until they finalize theirs.

**Manager review** — frame `Screen / Review — Manager review` (fqe9J) · US-3.4
Same scoring form, reviewing a direct report; per-dimension notes; feeds calibration.

**Upward review** — frame `Screen / Review — Upward review` (KguJq) · US-3.11, 3.12
Score your manager on the Company Culture framework only; **anonymous** (aggregate-only) banner.

**Review results** — frame `Screen / Review — Results` (To0hG) · US-3.14, 3.16
Overall weighted score hero + breakdown; per-competency **Self vs Manager** side-by-side (gap view, not blended) with agreement column; manager's written feedback. Visible only after release.

---

## Dashboards *(Phase 4, managers & admins only — employees never see this)*

**Dashboards** — frame `Screen / Dashboards` (K39A5t) · US-4.1–4.4
KPI tiles; Headcount & org shape (by function/tier/status); PTO (who's out this week, balances, liability); Review-cycle completion by team; Score distribution across Company Culture + Per role axes. Scope: managers see their team, admins see all.

---

## Onboarding / Level Up *(Phase 5)*

**Lessons library** — frame `Screen / Lessons` (P51vP) · US-5.1
Search + filters, "New lesson", cards showing type / duration / used-in / status.

**New lesson — type picker** — frame `Screen / New Lesson — Type` (F4CdN) · US-5.1
Modal to choose Video / Presentation / Text / Quiz.

**New lesson forms** — frames `New Lesson — Video / Presentation / Text / Quiz` (Q0giw8, xKV2Z, zSlJM, CpteK) · US-5.1, 5.2, 5.3
Video/Presentation embed a URL; Text = rich-text editor; Quiz = question builder (single/multi-select with correct options; open-written & open-video with a **model answer** for AI grading; pass mark). Settings side panel (type, required, estimated time, cover).

**Courses list** — frame `Screen / Courses` (w7R3d9) · US-5.4
Course cards: lessons, enrolled, avg completion, status. "New course".

**Course builder** — frame `Screen / New Course` (JVBPT) · US-5.4, 5.5, 5.6
Details (title, description, **auto-enroll new employees** toggle, visibility). Curriculum = a **day/week plan**: a "Divide by day/week" dropdown, lessons grouped under Day/Week N, day count derived. No due date here (computed per person).

**Add lessons modal** — frame `Screen / New Course — Add lessons` (s1DmGI) · US-5.4
Search + checklist of library lessons to add.

**Course — Manage / Enroll** — frames `Screen / Course — Manage` (nWb1O), `Course — Enroll people` (Eo2MK) · US-5.7, 5.6
Enrollment happens after publishing (individual / function-team / everyone). Manage view: stat tiles, **In progress** table (progress + pace flag: on-track / behind by N days) and **Completed** table (finish date + quiz score).

**Level Up home** — frame `Screen / Level Up` (QEp7y) · US-5.9 — ✅ **already scaffolded** at `app/level-up/page.tsx`
Assigned courses grouped in-progress / not-started / completed; each with progress, pace pill, due, CTA.

**Level Up — course plan** — frame `Screen / Level Up — Course` (lyNlw) · US-5.10
Progress hero + day-by-day plan with completed / current / locked lessons; "continue where I left off".

**Lesson players** — frames `Lesson — Video / Presentation / Text / Quiz` (P2H6B, ahz6T, g5qGp, geV3o) · US-5.11
Play video/slides, read text, or answer a quiz (select / write / record-or-upload video). Right-hand course outline; "mark complete & continue". Written/video answers graded by AI against the model answer.
