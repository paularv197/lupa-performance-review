# Lupa People — Design System Tracker

> Cross-session build tracker for the Pencil component library and screens. Update the Status column as pieces get built so the next session resumes without re-deriving context.
> Companion to `lupa_people_roadmap.md` and `lupa_people_user_stories.md`.

This is deliberately **slim**. Lupa already has a brand; this is three internal modules, not a sprawling multi-surface product. We build bottom-up (tokens → atoms → molecules → organisms → templates → screens) so every screen composes from referenced components, then we fill screens slice by slice in ship order: **Org Chart → PTO → Reviews → Dashboards** (Foundations/shell underpins all).

Status legend: ☐ to build · ◐ in progress · ✅ done. Everything starts ☐ (fresh project).

---

## Locked decisions

| Decision | Value |
|---|---|
| Theme | **Light only** (matches brand guidelines) |
| Primary / CTA | **`#00483B`** (Lupa green) |
| Titles | **`#2A2A2A`** |
| Surfaces | **`#FFFFFF`** (cards) / **`#F5F5F5`** (sections) |
| Body text | **`#4A4A4A`** (graphite) |
| Secondary palette | `#DCF1E9` `#B8DEFF` `#E6E6FA` `#FBE4E0` `#FFDAB9` `#FFF4D4` `#E8F3D6` `#E8D3FF` `#F3E5D8` |
| Typeface | **Satoshi** (primary); system mono for IDs/numbers |
| Icon set | Lucide outline, stroke 1.5 |
| Density | Comfortable (table cells ~12–14px vertical padding) |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64 |
| Radius scale | 6 (inputs/buttons), 8 (cards), 12 (dialogs/drawers), pill (badges) |
| Score scale | **0–3** everywhere reviews are scored |
| Platform | Responsive web; no native mobile |

**Secondary-palette usage convention** (low-saturation accents on white surfaces): assign each a semantic role so charts/status read consistently —
`#DCF1E9` green-tint = positive/approved/on-track · `#B8DEFF` blue-tint = info/in-progress · `#FFF4D4` amber-tint = pending/attention · `#FBE4E0` red-tint = denied/at-risk/PIP · `#E8D3FF` violet-tint = AI/recommendation · the rest for chart series. Lock exact mappings in Layer 1.

---

## Layered architecture

| Layer | Contents | Built by |
|---|---|---|
| 1. Tokens | Color, type, spacing, radius variables | foundation |
| 2. Atoms | Buttons, pills, fields, score chip, avatar, tooltip | compose from tokens |
| 3. Molecules | Table cells, filter chip, tabs, toasts, org node, scorecard row | compose atoms |
| 4. Organisms | App shell, data table, profile header, org tree, request drawer, scorecard, builders, dashboard cards | compose molecules |
| 5. Templates | List, detail, drawer/wizard, dashboard, builder, profile page layouts | compose organisms |
| 6. Screens | Per-slice screens | fill templates |

## Naming conventions

- Components PascalCase (`StatusPill`, `OrgNode`, `ScorecardRow`).
- Variants `Component/Variant` (`Button/Primary`, `StatusPill/Approved`).
- Tokens `$--token-name` (`$--color-primary`, `$--status-pto-approved`).

---

## Layer 1 — Tokens

| Token group | Status | Notes |
|---|---|---|
| Color — brand | ☐ | `--color-primary #00483B`, `--color-primary-hover`, `--color-title #2A2A2A`, `--color-body #4A4A4A` |
| Color — surfaces | ☐ | `--surface-card #FFFFFF`, `--surface-section #F5F5F5`, `--border`, `--ring` |
| Color — status/accent | ☐ | map the 9 secondary tints to semantic roles per the convention above |
| Color — score (0–3) | ☐ | a 4-step ramp for 0/1/2/3 (e.g. red-tint → amber-tint → green-tint family) |
| Typography | ☐ | Satoshi; sizes: xs 11, sm 12, base 14, lg 20, xl 28, display 40 |
| Spacing | ☐ | 4 → 64 scale |
| Radius | ☐ | 6 / 8 / 12 / pill |

---

## Layer 2 — Atoms

| Component | Status | Variants / notes |
|---|---|---|
| `Button` | ☐ | primary (`#00483B`), secondary, outline, ghost, destructive |
| `IconButton` | ☐ | default, ghost × md/sm |
| `FormField` | ☐ | text, textarea (long), select, date, with-error |
| `Checkbox` / `Toggle` | ☐ | for settings, half-day flags, framework publish |
| `StatusPill` | ☐ | pto: pending/approved/denied/cancelled · review: draft/released · pip: open/closed |
| `Badge/Function` | ☐ | Recruiting Ops / Revenue Ops / Product Ops |
| `Badge/Tier` | ☐ | Junior / Mid / Senior |
| `ScoreChip` | ☐ | 0–3 value chip using the score ramp |
| `Avatar` | ☐ | photo + initials fallback, xs/sm/md/lg |
| `Tooltip` | ☐ | **critical** — carries competency observable behaviors on the scorecard |
| `DateDisplay` | ☐ | short + relative/countdown |
| `BalancePill` | ☐ | PTO days, supports 0.5 |
| `SearchInput` | ☐ | org-chart + roster search |
| `Skeleton` | ☐ | line, block, node |

---

## Layer 3 — Molecules

| Component | Status | Notes |
|---|---|---|
| `TableCell/*` | ☐ | Text, Person (avatar+name), Status, Date, Number, Actions |
| `TableHeaderCell` | ☐ | sortable |
| `FilterChip` | ☐ | key:value + remove |
| `TabItem` | ☐ | active/inactive (profile + cycle tabs) |
| `BreadcrumbItem` | ☐ | for admin/builder depth |
| `Toast` | ☐ | success / error / info |
| `EmptyState` | ☐ | icon + title + description (e.g. no PTO yet) |
| `NavItem` | ☐ | sidebar, role-gated |
| `OrgNode` | ☐ | photo + name + title; click → profile; solid vs dotted connector treatment |
| `PersonMiniCard` | ☐ | used in overlap warnings, who's-out, search results |
| `OverlapRow` | ☐ | person + dates + **team / elsewhere** flag |
| `ScorecardRow` | ☐ | dimension label + definition + `Tooltip`(observable behaviors) + `ScoreChip` selector + note field |
| `CommitmentRow` | ☐ | text + result (accomplished/keep monitoring/not accomplished) |
| `CompetencyRow` | ☐ | builder rows (name, definition, observable behaviors, outcomes/impact) |
| `NotificationItem` | ☐ | in-app notification with unread state |

---

## Layer 4 — Organisms

| Component | Status | Notes |
|---|---|---|
| `AppShell` | ☐ | sidebar + topbar + content slot, light, Satoshi |
| `Sidebar` | ☐ | role-gated sections (Me / Team / Admin) |
| `DataTable` | ☐ | roster, PTO requests, approvals, cycle monitor |
| `ProfileHeader` | ☐ | avatar + name + title + function/tier + tenure |
| `OrgTree` | ☐ | renders `OrgNode`s, solid + dotted edges, pan/zoom, search-focus |
| `ReportingLineEditor` | ☐ | admin: set solid + dotted managers |
| `PTORequestDrawer` | ☐ | type (PTO/UTO/Half-Friday) + dates + half-day + note + live overlap warning |
| `ApprovalCard` | ☐ | request summary + overlap warning + approve/deny + restore-balance toggle |
| `WhosOutCalendar` | ☐ | upcoming approved absences (manager/admin scope) |
| `HalfFridayWindowAdmin` | ☐ | open/close monthly windows |
| `Scorecard` | ☐ | shared Company Culture block + Per Role block, made of `ScorecardRow`s |
| `FrameworkBuilder` | ☐ | Company Culture (Sections→Competencies) **and** Per Role variants; versioned, publish action |
| `CycleSetup` | ☐ | window + weight split (default 60/40) + campaign triggers |
| `CycleMonitor` | ☐ | completion % by team + nudge + reopen |
| `CycleResultCard` | ☐ | per-employee: axis averages, overall, self-vs-manager gap, AI tier recommendation |
| `TierRecommendationCard` | ☐ | suggestion + rationale (violet AI accent), advisory framing |
| `ScoreTrend` | ☐ | per-person history across cycles |
| `DashboardCard` | ☐ | metric/stat card for Phase 4 |
| `NotificationsPanel` | ☐ | list + unread |

---

## Layer 5 — Templates

| Template | Status | Used by |
|---|---|---|
| `ListPage` | ☐ | roster, PTO requests, approvals |
| `DetailPage` | ☐ | profile, PIP, acuerdo-style records |
| `DrawerForm` | ☐ | PTO request, balance adjust |
| `BuilderPage` | ☐ | framework builders |
| `DashboardPage` | ☐ | Phase 4 surfaces + cycle monitor |
| `ProfilePage` | ☐ | My Profile (home) + others' profiles |

---

## Layer 6 — Screens (by slice, ship order)

### Foundations / shell *(→ Phase 0)*
| Screen | Status | Notes |
|---|---|---|
| Sign-in (Google SSO) | ☐ | single-path |
| App shell | ☐ | role-gated nav |
| My Profile (home) | ☐ | tenure + PTO + pending tasks |
| Profile view (others) | ☐ | public fields + "How to work with me" |
| Profile edit | ☐ | own optional fields |
| Roster list (admin) | ☐ | DataTable + status |
| Person create/edit (admin) | ☐ | required structural fields |
| Config (functions/titles/tiers) | ☐ | admin lists |
| Activity log (admin) | ☐ | sensitive-action audit |

### Org Chart *(→ Phase 1, Slice 1)*
| Screen | Status | Notes |
|---|---|---|
| Org tree | ☐ | solid + dotted, search-to-person |
| Reporting-line editor (admin) | ☐ | re-parent + dotted lines |

### PTO *(→ Phase 2, Slice 2)*
| Screen | Status | Notes |
|---|---|---|
| My PTO (balance + history) | ☐ | live balance, request list |
| PTO request (drawer) | ☐ | PTO/UTO/Half-Friday + overlap warning |
| Approvals (manager) | ☐ | ApprovalCard + restore-balance |
| Who's out | ☐ | manager/admin scope |
| Half-Friday windows (admin) | ☐ | open per month |
| Balance adjust (admin) | ☐ | set/delta + note |

### Reviews *(→ Phase 3, Slice 3)*
| Screen | Status | Notes |
|---|---|---|
| Company Culture builder (admin) | ☐ | Sections→Competencies, versioned |
| Per Role builder (manager) | ☐ | per job title; Sections→Competencies, versioned |
| Coaching / scorecard (manager) | ☐ | shared + role blocks, tooltips, commitments |
| Self-assessment (employee) | ☐ | hidden until manager finalizes |
| Upward review (employee) | ☐ | anonymous |
| Commitments tracker (employee) | ☐ | carry-forward + results |
| PIP detail | ☐ | lightweight record |
| Cycle setup (admin) | ☐ | weights + campaign triggers |
| Cycle monitor (admin) | ☐ | completion % + nudges + reopen |
| Cycle result / employee scorecard | ☐ | gap view + AI tier recommendation + release |
| Score history (person) | ☐ | trend across cycles |

### Dashboards *(→ Phase 4)*
| Screen | Status | Notes |
|---|---|---|
| Headcount & org shape | ☐ | by function/tier/status |
| PTO dashboard | ☐ | who's out, balances, liability |
| Review completion | ☐ | % by team |
| Score distribution | ☐ | by axis, team/function |

### Onboarding & Level Up *(→ Phase 5)*
| Screen | Status | Notes |
|---|---|---|
| Lessons library (admin) | ☐ | search, new lesson, type/status |
| Lesson editor (admin) | ☐ | video / presentation / text / quiz variants |
| Quiz builder (admin) | ☐ | single/multi-select + open written/video + model answers |
| Courses list (admin) | ☐ | lessons, enrolled, completion, status |
| Course builder (admin) | ☐ | day/week plan, auto-enroll, visibility |
| Course manage (admin) | ☐ | enroll; in-progress (pace flags) + completed (dates) |
| Level Up home (employee) | ☐ | assigned courses: progress, pace, due |
| Course plan (employee) | ☐ | day-by-day, completed / current / locked |
| Lesson players (employee) | ☐ | video / presentation / text / quiz |

---

## Build sequencing notes

- **Tokens and the shared atoms/molecules first** — `ScorecardRow` + `Tooltip` + `ScoreChip` unlock the entire Reviews slice; `OrgNode` unlocks Org Chart; `PTORequestDrawer` + `ApprovalCard` + `OverlapRow` unlock PTO.
- **`FrameworkBuilder` is reused** for both Company Culture and Per Role frameworks — build once with a variant, not twice.
- **`Scorecard` is reused** across coaching, self-assessment, and upward review — same component, different framework version + audience.
- **AI accent (violet tint `#E8D3FF`)** is reserved for the tier recommendation so it always reads as advisory/AI, never as a final score.
- Update the Status columns as Pencil components land; record the Pencil node ID next to each so screens can reference components instead of redrawing them.

---

*Slim by design. If a fourth module or external-facing surface appears later, add a Layer-6 section; the lower layers should already cover it.*
