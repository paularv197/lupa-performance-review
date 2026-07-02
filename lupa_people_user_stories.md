# Lupa People — User Stories

A reference set of user stories describing the full flow of Lupa People, from roster setup through review cycles. Read sequentially the first time (it builds the picture slice by slice), then use as reference. Companion to `lupa_people_roadmap_v2.md`; phase numbers and IDs match it.

---

## How to read this document

Each story uses the standard format:

> **US-X.Y — Title**
> **As a** [persona] · **I want to** [capability] · **So that** [outcome]
>
> Acceptance criteria follow.

Cross-references like `→ Phase 2` point to the roadmap. This document is intentionally **not exhaustive** — it covers the stories that drive design and architecture, not every CRUD field. Stories are grouped by slice in ship order: Foundations → Org Chart → PTO → Reviews → Dashboards.

---

## Personas

**Employee.** Anyone on the roster. At Lupa everyone is a contractor treated as a regular employee — **no differentiation.** Sees their own data, the org chart, and their own reviews/PTO. Submits requests and assessments when assigned.

**Manager.** Not a separate role — a person becomes a Manager by having **at least one solid-line direct report.** Powers (approve PTO, run coachings, author role-KPI frameworks, see direct reports' reviews) apply to their **solid-line direct line only** — never skip-level, never sideways. Dotted-line relationships carry no authority.

**Admin.** Elevated base role; **Leadership/Exec folds in here** (no separate persona). Sees and does everything: roster, config, reporting lines, all PTO, all reviews, cycle management, dashboards. An Admin can **also** be a Manager.

> Throughout: "manager" means solid-line manager. A request/review never routes to a dotted-line manager.

---

## Phase 0 — Foundations & Roster

The system-of-record layer everything else reads from. → Phase 0.

**US-0.1 — Sign in with Google**
**As an** employee · **I want to** sign in with my Lupa Google account · **So that** I don't manage another password.
Acceptance: Google Workspace SSO is the only sign-in path. First sign-in matches the user to their roster record by work email; an email with no roster record is denied with a clear message.

**US-0.2 — Stand up the roster**
**As an** admin · **I want to** create a person and fill their required fields · **So that** the roster reflects the real company.
Acceptance: required fields — full name, work email, function, job title, tier, solid-line manager (nullable only for the CEO), base role, status, start date. The new person can sign in and appears on the org chart immediately.

**US-0.3 — Manage the config lists**
**As an** admin · **I want to** create functions, job titles, and tiers · **So that** I can classify people without engineering.
Acceptance: functions seed with Recruiting Ops / Revenue Ops / Product Ops (each with a head) and are extensible; tiers seed with Junior / Mid / Senior. A job title or tier in use cannot be deleted out from under a person (block or reassign).

**US-0.4 — Edit my own profile**
**As an** employee · **I want to** add my photo, address, date of birth, emergency contact, and a "How to work with me" note · **So that** my profile is complete and useful to teammates.
Acceptance: these fields are editable only by me (and admins). "How to work with me" is unbounded long text. Structural fields (title, tier, manager, function, role, status) are read-only to me.

**US-0.5 — My Profile is home**
**As an** employee · **I want** my landing page to show how long I've been at Lupa, my available PTO, and any pending tasks · **So that** I see what matters the moment I log in.
Acceptance: "My Profile" is the default route for every role. Shows tenure (from start date), live PTO balance, and a pending-tasks list (assessments to fill or review). PTO/tasks render as live data once Phases 2–3 ship.

**US-0.6 — Deactivate, reactivate, and delete**
**As an** admin · **I want to** deactivate a leaver, reactivate a returner or a mistake, and hard-delete when truly needed · **So that** the roster stays accurate without losing history.
Acceptance: deactivation sets status `inactive`, preserves all history (PTO, reviews), and removes the person from the active org chart; reactivation restores them; hard-delete is irreversible, admin-only, and confirmed with a warning. All three write to the activity log.

**US-0.7 — Role-appropriate UI**
**As an** employee · **I want to** see only what my role permits · **So that** sensitive data stays private.
Acceptance: nav and routes are gated by role; an employee never sees admin/manager surfaces. Permission denials are enforced server-side (RLS), not just hidden in the UI. → US-X.1.

---

## Phase 1 — Org Chart

The visibility gap, closed. → Phase 1.

**US-1.1 — See the org**
**As an** employee · **I want to** see the full reporting structure top-down · **So that** I understand who's who.
Acceptance: tree renders from the root (CEO, no manager) down. Each node shows photo, name, title. The whole company is visible to everyone.

**US-1.2 — See dotted-line relationships**
**As an** employee · **I want** matrix/dotted-line relationships shown distinctly from solid reporting · **So that** I understand both the formal and operational structure.
Acceptance: solid edges = primary reporting; dotted-line relationships render visually distinct (style/label). A person may have one solid manager and zero-or-more dotted-line managers.

**US-1.3 — Find a person fast**
**As an** employee · **I want to** search a name and jump to them · **So that** I reach anyone in two keystrokes.
Acceptance: search is the primary navigation (no department/my-team views or filters in v1). Match by name; selecting a result focuses them in the tree or opens their profile.

**US-1.4 — Open a profile from the chart**
**As an** employee · **I want to** click a node and open that person's full profile · **So that** I can read their "How to work with me" and details.
Acceptance: clicking a node opens the profile page. PTO and review data are not shown here — only public profile fields.

**US-1.5 — Edit reporting lines**
**As an** admin · **I want to** set and change who reports to whom, solid and dotted · **So that** the chart stays current.
Acceptance: admin-only. Changing a solid manager re-parents the node live. Adding/removing dotted-line managers updates the distinct edges. Changes write to the activity log.

**US-1.6 — Surface unparented people**
**As an** admin · **I want** people with no manager flagged · **So that** I notice gaps to fix.
Acceptance: anyone other than the intended root with a null solid manager renders as an unparented node, visually flagged as needing a manager.

---

## Phase 2 — PTO

Replacing the forms + spreadsheet. → Phase 2.

**US-2.1 — Request paid time off**
**As an** employee · **I want to** request PTO for a date range · **So that** my time off is tracked and approved.
Acceptance: pick type PTO, dates, optional half-day, note. The system computes business days (Mon–Fri, weekends excluded; no holiday calendars). PTO deducts the balance **on approval**, not on request.

**US-2.2 — Request unpaid time off**
**As an** employee · **I want to** request UTO · **So that** unpaid absences are still logged and approved.
Acceptance: same flow as PTO; **UTO never touches the balance**; it is approved, logged, and calendared.

**US-2.3 — Half-day granularity**
**As an** employee · **I want to** take a half-day · **So that** short absences are accurate.
Acceptance: a half-day counts as 0.5 against balance (PTO only). Balances and counts support 0.5 increments.

**US-2.4 — Warn me about overlaps when I request**
**As an** employee · **I want to** see who else is already off on my dates as I submit · **So that** I don't leave a gap.
Acceptance: at submission, any other person with overlapping approved/pending time off is shown **by name**, flagged "your team" vs "elsewhere." The warning informs but does not block.

**US-2.5 — Approve with full coverage context**
**As a** manager · **I want to** see the same overlap warning when I approve · **So that** I protect client coverage.
Acceptance: at approval, overlapping people are listed by name with the team/elsewhere distinction. Single-step approval to the **solid-line manager**. Decision notifies the requester in-app.

**US-2.6 — Balances accrue automatically**
**As an** employee · **I want** my balance to grow by one day a month without anyone touching it · **So that** I always know what I have.
Acceptance: +1.0 day on the 1st of each month for active people; unlimited carryover; no expiry. Each grant is logged.

**US-2.7 — Adjust a balance**
**As an** admin · **I want to** set or correct any balance · **So that** I can handle new-hire proration and mistakes.
Acceptance: admin sets an absolute value or a delta with a note; the adjustment is logged distinctly from monthly accrual.

**US-2.8 — Cancel or modify approved time off**
**As an** employee · **I want to** request a change or cancellation after approval · **So that** plans can shift.
Acceptance: cancel/modify is itself a request the manager approves. On approval the manager chooses **restore balance (default yes** for PTO; N/A for UTO/half-Friday). The calendar event updates accordingly.

**US-2.9 — Open a Half-Friday window**
**As an** admin · **I want to** open a half-Friday for a given month · **So that** the team can take the perk when we offer it.
Acceptance: admin opens a window (the eligible Friday + month label). The window enables half-Friday requests; it does not auto-grant time off to anyone.

**US-2.10 — Request my Half-Friday**
**As an** employee · **I want to** request the half-Friday off · **So that** I take it while ensuring we stay covered.
Acceptance: a half-Friday request is filed against an open window and **requires manager approval** (coverage), with the same overlap warning. It is **non-deducting**. On approval it calendars.

**US-2.11 — Approved time lands on the team calendar**
**As a** manager · **I want** approved PTO and half-Fridays on a shared calendar · **So that** the team sees who's out without asking.
Acceptance: on approval, an event is written to the shared Google team calendar; cancellation removes it.

**US-2.12 — See who's out**
**As a** manager · **I want** a who's-out view · **So that** I can plan around absences.
Acceptance: managers/admins see upcoming approved absences for the relevant scope. Employees see overlap names through the request flow, not a full roster of others' time off.

**US-2.13 — No self-approval**
**As an** admin who is also a manager · **I want** my own requests routed to another admin · **So that** no one approves their own time off.
Acceptance: a requester can never be their own approver; manager-admins' requests route to a different admin.

---

## Phase 3 — Performance Reviews

Scaling reviews with a system behind them. → Phase 3.

**US-3.1 — Build the Lupa Way framework**
**As an** admin · **I want to** define Sections, Competencies, definitions, observable behaviors, and outcomes/impact · **So that** everyone is scored against the same clear bar.
Acceptance: builder supports Sections grouping Competencies; each competency has a name, definition, observable behaviors, and outcomes/impact; scored 0–3. Mirrors the role-KPI builder in shape.

**US-3.2 — Edit the framework without rewriting history**
**As an** admin · **I want** my edits to apply only to future reviews · **So that** past reviews stay exactly as they were.
Acceptance: publishing edits creates a new framework **version**; reviews stamp the version in effect at creation; closed reviews never change when the framework is edited.

**US-3.3 — Build role KPIs**
**As a** manager · **I want to** define the KPIs for a job title · **So that** people in that role are measured on the right outcomes.
Acceptance: per job title (not per person, not per tier), a set of KPIs (qualitative or quantitative) each scored 0–3, versioned like the Lupa Way framework.

**US-3.4 — Run a coaching / check-in**
**As a** manager · **I want to** score a direct report on each dimension, leave a note per dimension, and set commitments · **So that** I coach continuously, not just at cycle time.
Acceptance: a coaching can be created anytime for a direct report; covers Lupa Way competencies + the person's role KPIs (0–3 each) with per-dimension notes; commitments can be added. Draft until released.

**US-3.5 — See what "good" looks like while scoring**
**As a** manager · **I want** observable behaviors on a tooltip in the scorecard · **So that** I score consistently.
Acceptance: each competency's observable behaviors surface as a tooltip on its scorecard row.

**US-3.6 — Track commitments across coachings**
**As a** manager · **I want** a commitment to carry into the next coaching with a result · **So that** follow-through is visible.
Acceptance: a commitment carries forward and is marked accomplished / keep monitoring / not accomplished in the following coaching.

**US-3.7 — A missed commitment opens a PIP**
**As a** manager · **I want** "not accomplished" to start a PIP · **So that** development is formalized.
Acceptance: marking a commitment "not accomplished" auto-creates a lightweight PIP linking employee, manager, and the source commitment, with status open/in-progress/closed and notes.

**US-3.8 — Release a coaching to the employee**
**As an** employee · **I want to** see released coachings and track my commitments · **So that** I know where I stand.
Acceptance: a coaching is private until the manager releases it; once released the employee sees scores, notes, and commitments and can follow their results over time.

**US-3.9 — Launch a self-assessment company-wide**
**As an** admin · **I want to** trigger a self-assessment for everyone on demand · **So that** people reflect ahead of a cycle.
Acceptance: a manual campaign assigns a self-assessment to all active people; it appears in each person's pending tasks.

**US-3.10 — Fill my self-assessment privately**
**As an** employee · **I want** my self-assessment hidden from my manager until they finish theirs · **So that** I'm honest and unbiased by their view.
Acceptance: self-assessment scores the same dimensions 0–3 with notes; it is not visible to the manager until the manager's side is finalized.

**US-3.11 — Launch upward reviews company-wide**
**As an** admin · **I want to** trigger upward reviews on demand · **So that** managers get feedback from their teams.
Acceptance: a manual campaign assigns each employee an upward review of their solid-line manager.

**US-3.12 — Review my manager anonymously**
**As an** employee · **I want** my upward feedback to be anonymous · **So that** I can be candid.
Acceptance: upward responses are aggregated to the manager without identities; no view exposes who said what.

**US-3.13 — Launch a cycle with a weight split**
**As an** admin · **I want to** launch a review cycle over a window and set the Lupa-Way/KPI weighting · **So that** the score reflects what we care about this cycle.
Acceptance: cycle has a window and a weight split (default 60% Lupa Way / 40% KPIs), editable at creation. Launching it can also fire the self/upward campaigns.

**US-3.14 — The cycle assembles the signal into scores**
**As an** admin · **I want** the cycle to gather the manager's in-window coachings plus the self-assessment (and upward, if run) and produce per-employee scores · **So that** scoring doesn't require managers to re-fill anything.
Acceptance: each axis is a simple average; overall = the weighted blend; the self-score shows side-by-side (gap view) and is not blended. Managers do not fill a fresh cycle form (→ D2).

**US-3.15 — Get an AI tier recommendation**
**As an** admin · **I want** an AI suggestion after scoring — keep in tier, promote, etc. — with a rationale · **So that** I have a starting point for the tier conversation.
Acceptance: generated server-side via the Anthropic API from the employee's scores, current tier, and trend; advisory only; never auto-applied; comp untouched.

**US-3.16 — Release results to the employee**
**As an** employee · **I want to** see my cycle scores only once they're released, and browse past released reviews · **So that** I get a deliberate, complete picture.
Acceptance: scores and the AI recommendation are hidden from the employee until an explicit release step; afterward the employee can browse all previously released assessments and scores.

**US-3.17 — Manage the cycle**
**As an** admin · **I want to** track completion %, send nudges, and reopen a review · **So that** the cycle actually finishes.
Acceptance: a cycle dashboard shows completion by team; in-app nudges go to laggards; a closed individual review can be reopened.

**US-3.18 — See a person's trend**
**As an** admin · **I want** score history per person over cycles · **So that** I see trajectory, not just a snapshot.
Acceptance: per-person view shows scores across cycles on both axes.

**US-3.19 — See my own upward feedback**
**As a** manager · **I want** to read my aggregated, anonymous upward feedback · **So that** I improve.
Acceptance: the manager sees aggregated results about themselves with no identifying information.

---

## Phase 4 — Dashboards (managers & admins)

→ Phase 4.

**US-4.1 — Headcount at a glance**
**As an** admin · **I want** headcount and org shape by function, tier, and status · **So that** I understand the company's composition.
Acceptance: on-screen counts and breakdowns; no export in v1.

**US-4.2 — PTO at a glance**
**As a** manager · **I want** who's-out-this-week, balances, and a simple liability view · **So that** I plan coverage.
Acceptance: scoped to the manager's team; admins see all.

**US-4.3 — Cycle completion at a glance**
**As an** admin · **I want** review-cycle completion by team · **So that** I chase the right people.
Acceptance: live % filled per team during an open cycle.

**US-4.4 — Score distribution at a glance**
**As an** admin · **I want** score distributions across the Lupa Way and KPI axes by team/function · **So that** I spot patterns.
Acceptance: on-screen distribution; employees never see this surface.

---

## Cross-cutting

**US-X.1 — Sensitive-by-default isolation**
**As an** employee · **I want** certainty that others can't see my PTO or reviews · **So that** I trust the tool.
Acceptance: default-deny on sensitive data; reads open only along own / direct-report / admin paths; enforced by RLS and verified per table.

**US-X.2 — In-app notifications**
**As an** employee · **I want** to be pinged in-app for approvals, decisions, assigned assessments, and nudges · **So that** I don't miss what needs me.
Acceptance: a notifications surface with unread state; real-time delivery. No Slack/email in v1.

**US-X.3 — Activity log**
**As an** admin · **I want** an audit trail of sensitive actions · **So that** "who changed what" is answerable.
Acceptance: append-only log of PTO approvals/denials, review releases, role and reporting-line changes, deactivate/reactivate/delete; admin-readable.

**US-X.4 — Works on a phone**
**As an** employee · **I want** PTO requests and the org chart to work on my phone · **So that** I'm not tied to a desktop.
Acceptance: responsive web; no native app in v1.

**US-X.5 — On brand**
**As an** employee · **I want** the tool to look like Lupa · **So that** it feels like ours.
Acceptance: light mode, Satoshi, `#00483B` primary, the defined palette throughout.

---

## Open questions (mirror roadmap §7)

- **OQ-1.** Seed content for the first Lupa Way framework version (Sections + Competencies with definitions/observable-behaviors/outcomes).
- **OQ-2.** Product name (placeholder: "Lupa People").
- **OQ-3.** Who authors a role-KPI framework when a job title spans multiple managers (default: any manager; recommended: function head).
- **OQ-4.** Half-day AM/PM designation vs. just "half."
- **OQ-5.** Confirm CEO is the single root and their own PTO routes to an admin.
- **OQ-6.** Confirm the AI tier action set (default: Keep / Promote / Develop / Flag for PIP review).

---

*Living document. As the design partner (you) reviews these, split, reprioritize, and add stories with the next ID in their slice.*
