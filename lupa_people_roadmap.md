# Lupa People — Build Roadmap v2

A phased roadmap for **Lupa People**, an internal people-operations tool covering **Org Chart**, **PTO**, and **Performance Reviews** for Lupa (≤50 people, contractors-treated-as-employees, across LatAm + a US-based CEO).

Designed to be **designed in Pencil and built in Lovable + Supabase**, one slice at a time, in the order **Org Chart → PTO → Reviews**. Intended to be executed in a single build week.

> *Working name is "Lupa People." Rename freely; it appears in exactly one place (the app shell) and one open question at the bottom.*

---

## Changelog from v1

v2 integrates the decision round on §0:

1. **Cycle scoring is a configurable weighted blend.** Each side is a simple average (no per-dimension weights). Overall defaults to **60% Lupa Way / 40% role KPIs**, and **admins set the split in the UI when creating a cycle.**
2. **Half-Friday is a per-person, approval-gated entitlement** — not a blanket company day. Admins open a half-Friday window for a month; each person *requests* theirs and a manager approves it (to protect client coverage). Still non-deducting.
3. **Assessment frameworks are structured and versioned.** The Lupa Way framework gains Sections → Competencies (with definition, observable behaviors, outcomes/impact). Edits create a **new version** that applies to **future reviews only**; past reviews stay frozen on the version they were built with. The same versioning applies to role-KPI frameworks.
4. **AI tier recommendation added.** After a cycle is scored, an AI suggestion (Keep in tier / Promote / etc., with rationale) is generated via the Anthropic API. Advisory only; comp stays walled off.
5. **Light mode**, matching brand guidelines (resolves the v1 dark/light palette conflict).

---

## What this replaces / why it exists

Three concrete gaps, in priority order:

1. **No one can see the current org structure.** No source of truth for who reports to whom. → Org Chart ships first.
2. **PTO lives in forms + a spreadsheet.** Manual, no balances, no overlap visibility. → PTO ships second.
3. **Performance reviews happen with no system behind them.** They don't scale and leave no trace. → Reviews ships third.

This tool is the **system of record for the employee roster.** No payroll/HRIS integration (there is none to integrate with).

---

## 0. Locked product decisions

The decisions that shape the schema, now settled. Tagged with their D-labels for traceability.

- **D1 — Cycle scoring.** Each axis is a **simple average** of its 0–3 scores (no per-dimension weights). **Overall = a weighted blend of the two axes, default 60% Lupa Way / 40% role KPIs, admin-configurable per cycle at creation.** The employee's **self-score is shown side-by-side** with the manager score (gap view) and is **not blended** into the official number. Admins can reopen and adjust.
- **D2 — Managers don't re-fill at cycle time.** A cycle **assembles the coachings the manager already wrote** in the window as the manager's contribution. The admin's bulk action adds the self-assessment (and the upward review, if launched).
- **D3 — PIP is lightweight.** A commitment marked **"not accomplished"** auto-creates a **flagged, trackable PIP record** (not a multi-step workflow).
- **D4 — Half-Friday is a non-deducting, approval-gated request.** Admins open a half-Friday window per month; each person **requests** their half-Friday and a manager **approves** it (coverage protection). Does **not** deduct PTO balance.
- **D5 — "Manager" is derived.** Base role is **Employee** or **Admin**. A person is a **Manager** by having ≥1 solid-line direct report. Manager powers apply to **solid-line direct reports only.** **Dotted-line = org-chart visibility only** (no approval/review power). A person can be Admin **and** Manager.
- **D6 — Frameworks are admin-built and versioned.** Admins build the Lupa Way framework in-app (Sections → Competencies, each with definition, observable behaviors, outcomes/impact). Edits create a **new version**; **only future reviews** use it, past reviews stay frozen. Same model for role-KPI frameworks.

**Other locked defaults:**

- **PTO day count** excludes Sat/Sun; **no holiday calendars** in v1 (uniform policy, no legal-holiday tracking), including for the US-based CEO.
- **Accrual** = +1.0 day on the 1st of each month for active people; unlimited carryover; no expiry. Admins can set/override any balance anytime (covers new-hire proration and corrections).
- **UTO** never touches a balance — approved, logged, calendared only.
- **No self-approval.** A request from a manager-who-is-also-admin routes to a different admin.
- **Required roster fields** (admin-set): full name, work email, function, job title, tier, solid-line manager (nullable only for the CEO/root), base role, status, start date. **Optional, employee-editable**: photo, full address, date of birth, emergency contact, "How to work with me."
- **KPI frameworks are per job title, not per tier.** Tier is a label on the person; it doesn't fork the KPI set.
- **Overlap warning spans the whole company** but visually distinguishes "your team" from everyone else.

---

## 1. Architectural principles (lock before Phase 0)

**Single-org, not multi-tenant.** Exactly one Lupa workspace. No `tenant_id`, no tenant switcher, none of the isolation machinery a multi-tenant product needs. The single biggest simplification versus a typical SaaS build.

**The person is the central record.** `people` is the aggregate. PTO, reporting lines, coachings, assessments, balances — everything FKs to a `person_id`. Get this table right first; the other two modules are lenses on it.

**RBAC = base role + derived manager capability.** Base role is `employee` or `admin` (Leadership folds into Admin). Manager-ness is **derived** from the org chart. Three questions govern every read: *Is this my own data? Is this my direct report's data? Am I an admin?* Sensitive data (PTO, reviews) is invisible by default and opens only along those three paths.

**Sensitive-by-default visibility.** Reviews and PTO are personal. Default deny. Employee sees only their own; manager sees their **solid-line direct line only** (never skip-level, never sideways); admin sees all. Enforced in Supabase **Row-Level Security**, not just the UI — the UI is not a security boundary.

**Frameworks are versioned; reviews freeze their version.** The Lupa Way framework and each role-KPI framework are versioned. When a coaching, self-assessment, or cycle is created, it **captures the framework version in effect at that moment.** Later edits create a new version and never mutate past reviews. (This is the prior project's "frozen artifact" idea, right-sized: a review you signed off on last quarter must still read the way it did then.)

**Config over code.** Functions, job titles, tiers, and both framework types are **data in tables**, editable in-app — never hardcoded.

**AI is advisory, server-side, and walled off from comp.** The tier recommendation is generated via the Anthropic API from a **Supabase Edge Function** (API key in Supabase secrets — never client-side). It produces a suggestion + rationale a human reviews; it never auto-changes a tier and never touches compensation.

**Lifecycle, not deletion (with an escape hatch).** People move `active → inactive` (history retained; reactivatable). Admins can also **hard-delete** a person (irreversible). Only admins deactivate, reactivate, or delete.

**A light activity log, not event-sourcing.** Append-only `activity_log` for sensitive actions (PTO approve/deny, review release, role/reporting-line changes, deactivate/delete). Skip the full event-sourced spine.

**Scheduled work is minimal.** The only recurring job in v1 is monthly PTO accrual (pg_cron). Everything else is request/response.

**Light mode, English, responsive web.** One theme, no i18n, no native mobile. Responsive web covers phone use of PTO and Org Chart.

---

## 2. Technology stack

**Design:** Pencil (`.pen`), one canvas, one vertical lane per slice (Org → PTO → Reviews → Dashboards), left-to-right = ship order. *(Lightweight convention from the prior project; no separate canvas-reorganization spec unless the canvas grows large.)*

**Build:** Lovable (React + Tailwind + shadcn/ui).

**Backend:** Supabase — Auth, Postgres with RLS, Storage (profile photos), Edge Functions (Google Calendar sync; Anthropic API call for tier recommendations), pg_cron (monthly accrual), Realtime (in-app notifications).

**Auth:** Supabase Auth with **Google Workspace SSO** (everyone is on Google). No password/magic-link path needed.

**Integrations (v1):**
- **Google Calendar** — approved PTO, approved half-Fridays write to a **shared team calendar** (Edge Function).
- **Anthropic API (Claude)** — tier recommendation generation, server-side via Edge Function using Lupa's Claude account.
- **In-app notifications** — `notifications` table + Realtime. **No Slack or email in v1** (deferred).

**Brand tokens (light):**
- Primary / CTA: **`#00483B`** (Lupa green)
- Titles: **`#2A2A2A`**
- Surfaces: **`#FFFFFF`** / **`#F5F5F5`** (sections)
- Body text: **`#4A4A4A`** (graphite)
- Secondary palette (accents / status / charts): `#DCF1E9`, `#B8DEFF`, `#E6E6FA`, `#FBE4E0`, `#FFDAB9`, `#FFF4D4`, `#E8F3D6`, `#E8D3FF`, `#F3E5D8`
- Typeface: **Satoshi**

---

## 3. Data model (high-level, by module)

Full field lists land in each phase. This is the shape.

**Core / roster (Phase 0)**
- `people` — id, full_name, work_email, photo_url, function_id, job_title_id, tier_id, manager_id (solid, nullable), base_role (`employee`|`admin`), status (`active`|`inactive`), start_date, address, date_of_birth, emergency_contact (name/relationship/phone), how_to_work_with_me (long text), created_at.
- `functions` — id, name, head_person_id. *(Seed: Recruiting Ops, Revenue Ops, Product Ops; admins can add.)*
- `job_titles` — id, name. `tiers` — id, name *(seed: Junior, Mid, Senior)*.
- `dotted_line_managers` — person_id, manager_id (zero-or-more per person; visibility only).
- `activity_log` — id, actor_id, action, target_type, target_id, payload jsonb, occurred_at.
- `notifications` — id, recipient_id, type, body, link, read_at, created_at.

**PTO (Phase 2)**
- `pto_balances` — person_id, balance_days (0.5 increments).
- `half_friday_windows` — id, eligible_date (the Friday), month_label, is_open (bool), created_by.
- `pto_requests` — id, person_id, type (`PTO`|`UTO`|`HALF_FRIDAY`), start_date, end_date, half_day_flag, window_id (for half-Friday), business_days (computed), deducts_balance (bool: true PTO / false UTO+half-Friday), status (`pending`|`approved`|`denied`|`cancelled`), note, approver_id, decided_at.
- `pto_request_changes` — id, request_id, kind (`modify`|`cancel`), proposed_payload jsonb, status, restore_balance (bool, manager-set on approval), decided_by, decided_at.
- `pto_accrual_log` — person_id, period, amount, source (`monthly`|`admin_adjustment`), note.

**Reviews (Phase 3)**
- *Lupa Way framework (versioned):* `lupa_framework_versions` (id, version_no, status, published_at, published_by) → `lupa_sections` (id, version_id, name, order) → `lupa_competencies` (id, section_id, name, definition, observable_behaviors, outcomes_impact, order; scored 0–3).
- *Role-KPI frameworks (per job title, versioned):* `kpi_framework_versions` (id, job_title_id, version_no, status, authored_by) → `kpis` (id, version_id, name, kind `qualitative`|`quantitative`, definition, target_or_descriptor, order; scored 0–3).
- `review_cycles` — id, name, window_start, window_end, lupa_weight (default 0.60), kpi_weight (default 0.40), status (`draft`|`open`|`closed`), launched_by.
- `coachings` (check-ins) — id, employee_id, manager_id, lupa_version_id, kpi_version_id, created_at, status (`draft`|`released`). `coaching_scores` — coaching_id, dimension_ref, score (0–3), note. `commitments` — id, coaching_id, text, result (`pending`|`accomplished`|`keep_monitoring`|`not_accomplished`), carried_into_coaching_id.
- `self_assessments` — id, employee_id, cycle_id (nullable for ad-hoc), lupa_version_id, kpi_version_id, status (`assigned`|`submitted`), submitted_at. `self_assessment_scores` — dimension/score/note.
- `upward_reviews` — id, manager_id (subject), cycle_id, **anonymous**, submitted_at. `upward_review_scores` — dimension/score/note.
- `review_scores` (cycle output) — id, cycle_id, employee_id, lupa_avg, kpi_avg, lupa_weight, kpi_weight, overall (computed), self_lupa_avg, self_kpi_avg. `review_score_dimensions` — per-dimension manager_score + self_score breakdown.
- `tier_recommendations` — id, cycle_id, employee_id, current_tier_id, suggested_action (`keep`|`promote`|`develop`|…), rationale, model, generated_at, reviewed_by, decision (nullable).
- `pips` — id, employee_id, manager_id, source_commitment_id, description, status (`open`|`in_progress`|`closed`), notes, created_at.

---

## 4. Phases / slices

Each phase is a demoable unit. Within a phase: data model → workflows → permissions → definition of done.

### Phase 0 — Foundations & Roster *(prerequisite for everything)*

**Goal:** Auth works, the roster exists as the system of record, every person has a profile and a "My Profile" landing page.

**Build:**
- Supabase project, Google SSO, base schema (`people`, `functions`, `job_titles`, `tiers`, `dotted_line_managers`, `activity_log`, `notifications`).
- App shell (light, Satoshi), role-gated nav.
- **Admin: roster management** — create/edit a person (all required fields), assign function/job-title/tier/solid-line manager/base-role, deactivate, reactivate, hard-delete. Manage config lists (functions, job titles, tiers).
- **Everyone: own profile** — edit photo, address, DOB, emergency contact, "How to work with me"; view tenure.
- **"My Profile" landing page** (default home for all roles): days at Lupa, available PTO balance (stub until Phase 2), **pending tasks** (assessments to fill/review — stub until Phase 3).
- RLS: everyone reads basic roster fields (needed for org chart + overlap names); edits only own profile; admins edit anything.

**Definition of done:** an admin stands up the full roster from scratch; everyone logs in via Google and completes their profile; "My Profile" renders real tenure with stubbed PTO/tasks.

---

### Phase 1 — Org Chart *(Slice 1 — ships first)*

**Goal:** Anyone can see the current org structure and jump to a person's profile.

**Data model:** `people.manager_id` (solid) + `dotted_line_managers` (dotted). Root = the person with `manager_id = null` (the CEO).

**Workflows:**
- **Render** the tree top-down from the root. Solid edges = primary reporting; **dotted/visually-distinct edges = dotted-line**. Node = photo + name + title; click → full profile page.
- **Search-to-person** (the only navigation in v1 — no department/my-team views, no filters).
- **Admin-only editing** of reporting lines (set/change solid manager; add/remove dotted-line managers).
- People with no manager render as unparented roots (admin's cue to fix).

**Permissions:** everyone views the whole chart and any profile's public fields. Only admins edit lines.

**Out of scope (v1):** open roles, org history, contractor show/hide toggle, by-department/my-team views, filters.

**Definition of done:** the real Lupa tree renders with ≥1 dotted-line relationship; search jumps to any person; admin re-parents someone and the tree updates.

---

### Phase 2 — PTO *(Slice 2)*

**Goal:** Employees request PTO/UTO/half-Fridays, balances track automatically, managers approve with full overlap context, approved time lands on a shared calendar.

**Data model:** `pto_balances`, `half_friday_windows`, `pto_requests`, `pto_request_changes`, `pto_accrual_log`.

**Workflows:**
- **Accrual engine** — pg_cron grants **+1.0 day/month** to active people; logged. **Admins set/adjust** any balance (new-hire proration, corrections).
- **Request flow** — pick **PTO / UTO / Half-Friday**, dates, optional **half-day**, note. System computes **business days (Mon–Fri, no holidays)**. **PTO deducts on approval; UTO and Half-Friday never touch the balance.**
- **Half-Friday** — admins open a **half-Friday window** for a month. Each person **requests** their half-Friday against the open window; a manager **approves** (coverage protection). Non-deducting; calendared on approval.
- **Overlap warning** — at **submission and again at approval**, show every other person with overlapping approved/pending time off, **by name**, flagged **"your team" vs "elsewhere."**
- **Approval** — single step to the **solid-line manager**. No self-approval (admin-managers route to another admin). In-app notifications on submit and decision.
- **Cancel / modify** — submitted as a **change request**; manager approves and **chooses whether to restore balance (default: yes** for PTO; N/A for UTO/half-Friday).
- **Google Calendar** — approved PTO and half-Fridays write to the **shared team calendar.**
- **My Profile** shows live balance; a "who's out" surface is available to managers/admins.

**Permissions:** employee sees own PTO + balance; manager sees + approves direct reports' requests; admin sees/approves all. Overlap **names** are visible company-wide (the point); full request detail follows normal visibility rules.

**Out of scope (v1):** maternity/paternity & medical leave (v2), accrual caps/expiry, per-country holiday calendars, payroll export, hard blackout/max-%-out rules (we warn with names, not block).

**Definition of done:** a request flows submit → overlap-warned → approve → balance deducts → calendar event appears; a cancel restores balance; an admin opens a half-Friday window, a person requests it, a manager approves it, it calendars without charging anyone.

---

### Phase 3 — Performance Reviews *(Slice 3 — the deep one)*

**Goal:** Every employee is measured on **two axes — the Lupa Way framework and their role's KPIs** — through ongoing manager coachings plus admin-triggered self and upward assessments, rolled up into per-employee scores on demand, with an AI tier suggestion.

**Data model:** the framework, coaching, assessment, cycle, scoring, tier-recommendation, and PIP entities in §3.

**Framework builders (admin/manager, versioned):**
- **Lupa Way builder** (admin) — create **Sections** that group **Competencies**; each competency has a **name, definition, observable behaviors** (surfaced as a **tooltip** on the scorecard), and **outcomes/impact**; scored **0–3**. Editing **publishes a new version**; future reviews use it, past reviews stay frozen.
- **Role-KPI builder** (manager) — per job title, a set of **KPIs** (qualitative or quantitative), each with a definition/target; scored **0–3**; versioned the same way.
- Every assessment form = **shared Lupa Way block + the person's role-KPI block.**

**Workflows:**
- **Manager coachings (check-ins)** — a manager creates a coaching for a direct report **anytime**: score each dimension 0–3, write a **note per dimension**, set **commitments**. **Draft → released**; once released the employee sees it and **tracks commitments.**
- **Commitment lifecycle** — a commitment carries into the **next** coaching with a result: **accomplished / keep monitoring / not accomplished.** **"Not accomplished" auto-creates a PIP** (lightweight).
- **Self-assessments** — employees fill when assigned. **Admin triggers a company-wide self-assessment campaign** on demand. A self-assessment is **hidden from the manager until the manager's side is finalized.**
- **Upward reviews** — **admin triggers a company-wide upward campaign** on demand; each employee reviews their solid-line manager; **anonymous** to the manager; aggregated identity-free.
- **Review cycle** — admin **launches manually** with a window **and sets the Lupa-Way/KPI weight split** (default 60/40). On close, the cycle **assembles all in-window coachings** (manager signal) **+ the self-assessment campaign** (+ upward if launched) and **computes per-employee scores**: each axis averaged, overall = the weighted blend; self shown side-by-side (not blended).
- **AI tier recommendation** — after scoring, an Edge Function calls the **Anthropic API** with the employee's cycle scores (both axes), current tier, and trend, returning a **suggested action (Keep in tier / Promote / Develop / …) with a short rationale.** Stored on `tier_recommendations`; **advisory only** — a human reviews; never auto-applied; comp untouched.
- **Release to employee** — explicit step; before it, cycle scores and the recommendation are not visible to the employee. After it, the **employee can browse all previously released assessments/scores.**
- **Admin cycle ops** — launch, **track completion %**, send **in-app nudges**, **reopen** a review, view **score history/trend per person.**

**Permissions:** employee sees own released coachings/self-assessments/cycle scores + submits assigned self/upward; manager authors + sees their direct reports' coachings, owns the role-KPI frameworks, sees own anonymous upward feedback; admin sees and does all. Self-before-manager sequencing and the release gate are enforced in RLS.

**Out of scope (v1):** peer reviews (v2), comp linkage (walled off), exportable review PDFs.

**Definition of done:** an admin builds a versioned Lupa Way framework; a manager builds a role-KPI framework and runs two coachings with a carried commitment that fails and spawns a PIP; an admin launches self + upward campaigns and a cycle with a custom weight split; the cycle produces per-employee scores with a self/manager gap and an AI tier suggestion; release makes scores visible to the employee; editing a framework afterward does not change the closed cycle; completion % and nudges work.

---

### Phase 4 — Dashboards *(managers & admins only)*

**Goal:** At-a-glance visibility for managers (their scope) and admins (all).

**Surfaces (on-screen only, v1):**
- **Headcount & org shape** (by function, tier, status).
- **PTO** — who's out this week, balances, simple liability view.
- **Review-cycle completion** — % filled, by team.
- **Score distribution** — across the Lupa Way + KPI axes, by team/function.

**Out of scope (v1):** attrition analytics, exportable reports.

**Definition of done:** a manager sees their team's PTO + review completion + score spread; an admin sees the whole company; employees never see this surface.

---

## 5. The MVP cut, stated honestly

**In v1:** roster as system of record; Google SSO; profiles + "My Profile" home; org chart (solid + dotted, search, admin-edit); PTO/UTO/half-Friday with auto-accrual, half-days, overlap warnings, cancel/modify, half-Friday windows + requests, shared-calendar write; full reviews (two versioned-framework axes, framework builders, coachings, commitments→PIP, self + upward campaigns, manual cycles with configurable weights, scoring, AI tier suggestion, release, history); manager/admin dashboards; in-app notifications; light activity log; light-mode responsive web.

**Explicitly deferred to v2+:** maternity/paternity & medical leave; peer reviews; comp linkage; Slack & email notifications; native mobile; exportable reports; org-chart history, open roles, department/my-team views & filters; per-country holiday calendars; payroll export; accrual caps/expiry.

---

## 6. Recommended Lovable working pattern

For each slice (Org → PTO → Reviews → Dashboards):

1. **Design the slice in Pencil first** against this roadmap and the (forthcoming) User Stories.
2. **Schema first in Supabase**, then **test RLS per table** — sensitive-by-default means a missing policy leaks reviews or PTO. Verify each role's read/write before touching UI.
3. **Build the slice in Lovable** referencing the Pencil mockup and design tokens.
4. **Keep secrets server-side** — the Anthropic API key and Google Calendar credentials live in Supabase secrets and are only ever called from Edge Functions, never the client.
5. **One slice demoable before the next.** Phase 0 (roster) underpins all three and is not optional.
6. **Walk the definition of done** as the ship gate.

---

## 7. Open questions to resolve before/while building

1. **Seed the Lupa Way framework.** Not blocking (admins build it in-app), but a real first version — Sections + Competencies with definitions/observable-behaviors/outcomes — would let the design show true content instead of lorem. Send it when convenient.
2. **Product name** — "Lupa People" is a placeholder.
3. **Role-KPI framework authorship** when a job title spans more than one manager. Default: any manager can edit it; recommended: the function head owns it. Confirm.
4. **Half-day mechanics** — a half-day is 0.5 of a day for balance; do you need an AM/PM designation, or just "half"? Assumed 0.5 with an optional AM/PM tag.
5. **CEO / root** — confirm the CEO is the single tree root (`manager_id = null`) and that their own (rare) PTO routes to an admin approver.
6. **AI tier actions** — confirm the suggestion set. Default: **Keep in tier / Promote / Develop further / Flag for PIP review.** Add/remove as you like.

---

*This roadmap is the spine. Once you've reacted, I'll generate the **User Stories** (personas + per-slice stories with acceptance criteria) and the **slim Design System Tracker** (locked light-mode tokens, component layers, screen checklist) to match — all three aligned so they read as one set.*
