# Lupa People — Lovable master prompt

> Paste this as the **first / system prompt** in your Lovable project. It sets the product, stack, design system, and rules. Then build screens one at a time with `LOVABLE_SCREENS.md`, attaching each Pencil frame's screenshot as the visual reference.

## Product

**Lupa People** is an internal people-operations tool for **Lupa** (≤50 people; everyone is a contractor treated as a regular employee — no differentiation). It covers **Org Chart, PTO, Performance Reviews, Dashboards, and Onboarding / Level Up**. Single-org (not multi-tenant). Light mode only. English only. Responsive web (works on phones); no native app.

Full spec lives in three companion docs — treat them as the source of truth:
- `lupa_people_roadmap.md` — phases, locked decisions, data model, DoD
- `lupa_people_user_stories.md` — US-x.y stories + acceptance criteria
- `lupa_people_design_system_tracker.md` — component + screen checklist

## Stack

- **Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui.**
- **Supabase** — Auth (Google Workspace SSO only), Postgres with **Row-Level Security**, Storage (profile photos + lesson covers), Edge Functions (Google Calendar sync; Anthropic API for tier recommendations + AI answer grading), pg_cron (monthly PTO accrual), Realtime (in-app notifications).
- Icons: **lucide-react**. Never invent a component library — reuse the primitives in `components/ui` and `components/layout`.

## Design system (non-negotiable)

Tokens are already wired in `app/globals.css` + `tailwind.config.ts`. **Never hardcode a hex.** Use the token classes:

- Surfaces: `bg-background` (#F5F5F5), `bg-card` (#FFFFFF), `bg-section` (#F5F5F5)
- Text: `text-foreground` (#2A2A2A, titles), `text-body` (#4A4A4A), `text-muted-foreground` (#8A8A85)
- Lines: `border-border` (#E7E7E3), connector `#CFCFCA`
- Brand: `bg-primary` / `text-primary` (#00483B), `hover:bg-primary-hover` (#00352A), `bg-primary-tint` (#DCF1E9), `text-primary-foreground` (#FFFFFF)
- Status (bg + fg pairs): `approved` (green), `info` (blue), `pending` (amber), `denied` (red), `neutral` (grey), `ai` (violet — reserved for AI/advisory, e.g. tier recommendation & answer grading)
- Review score scale 0–3: `score-0` (red) → `score-1` (amber) → `score-2` (olive) → `score-3` (green)
- Radii: `rounded-input` (6, inputs), `rounded-card` (8, cards), `rounded-dialog` (12, modals), `rounded-pill` (badges/buttons)
- Fonts: **Manrope** (`font-sans`, stands in for Satoshi), **IBM Plex Mono** (`font-mono`, for numbers/scores)

**Primitives already built (reuse, don't recreate):** `Button` (primary/secondary/outline/ghost/destructive), `StatusPill`, `ScoreChip`, `FunctionBadge`/`TierBadge`, `Avatar`, `Card`, `Input`/`Field`, `Sidebar`/`AppShell`/`NavItem`. See `app/level-up/page.tsx` for how they compose a full screen.

Layout: every app screen is `<AppShell>` (fixed 248px sidebar + scrollable main). Main content uses `p-8`, section gaps `gap-6`, uppercase 11px section labels, cards with `p-5`/`p-6`.

## Personas & permissions (enforce in RLS, not just UI)

- **Employee** — sees own data, the org chart (everyone), own PTO/reviews/courses.
- **Manager** — *derived*: anyone with ≥1 solid-line direct report. Powers apply to **solid-line direct reports only** (never skip-level, never sideways). Dotted-line = visibility only.
- **Admin** — sees/does everything (roster, config, all PTO, all reviews, cycles, dashboards, lessons/courses). Can also be a Manager.

**Sensitive-by-default:** PTO and reviews are invisible unless it's *your own*, *your direct report's*, or *you're an admin*. Enforce with Supabase RLS per table — the UI is not a security boundary.

## Key locked decisions

- Cycle overall score = weighted blend, default **60% Company Culture / 40% Per role**, admin-set per cycle. Self-score shows **side-by-side (gap view), not blended**.
- Frameworks (**Company Culture** + **Per Role**, per job title) are **versioned**; a review freezes the version it was created with.
- PTO: business days (Mon–Fri, no holidays); +1 day/month accrual; PTO deducts on approval; UTO + Half-Friday never deduct. Half-Friday = admin opens a monthly window, each person requests, manager approves.
- No self-approval. Manager-admins route their own requests to another admin.
- AI is advisory, server-side (Edge Function + Anthropic API), never auto-applied, walled off from comp.

## Build order

Ship one slice at a time, walking each phase's "definition of done": **Org Chart → PTO → Reviews → Dashboards → Onboarding/Level Up.** For each: schema in Supabase → test RLS per table → build UI referencing the Pencil frame + these primitives.
