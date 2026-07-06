# Lupa People — Lovable starter

A Next.js + Tailwind starter that encodes the **Lupa People** design system (light mode, Manrope, `#00483B`) and the reusable primitives from the Pencil design. Use it as the on-brand foundation that Lovable extends, page by page.

## What's here

```
app/
  globals.css        # design tokens (single source of truth) + base layer
  layout.tsx         # fonts (Manrope + IBM Plex Mono) wired as CSS vars
  page.tsx           # starter landing — primitives showcase
  level-up/page.tsx  # EXAMPLE screen generated from the Pencil frame "Screen / Level Up"
components/
  ui/                # Button, StatusPill, ScoreChip, Badge, Avatar, Card, Input/Field
  layout/            # Sidebar, AppShell, NavItem
tailwind.config.ts   # maps every token to a Tailwind color/radius/font
LOVABLE_MASTER_PROMPT.md   # paste this into Lovable FIRST
LOVABLE_SCREENS.md         # one build prompt per screen, in ship order
```

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000  (and /level-up)
```

## How to use with Lovable

1. **Connect this repo** to a Lovable project (Lovable → GitHub). It starts from the tokens + primitives, so everything it builds is on-brand.
2. **Paste `LOVABLE_MASTER_PROMPT.md`** as the project's system/first prompt — it sets the stack, palette, fonts, component rules, and the permissions model.
3. **Build slice by slice** using `LOVABLE_SCREENS.md` — one prompt per screen, each tied to a user story (US-x.y) and its Pencil frame. Follow the roadmap order: Org Chart → PTO → Reviews → Dashboards → Level Up.
4. For each screen, **attach the screenshot** of the matching Pencil frame as the visual reference (export from Pencil, or open `lupa-performance-review.pen`).
5. **Wire Supabase** per phase (schema in `lupa_people_roadmap.md` §3, then RLS, then UI) — see the master prompt.

## Design-system notes

- **Tokens live in `app/globals.css`** as CSS variables and are exposed to Tailwind in `tailwind.config.ts`. Never hardcode a hex — use `bg-primary`, `text-muted-foreground`, `bg-status-info-bg`, `bg-score-3-bg`, `rounded-card`, etc.
- **Manrope stands in for Satoshi** (the brand face). Swap in Satoshi via a local `@font-face` once licensed — only `layout.tsx` changes.
- **Icons:** `lucide-react` throughout (matches the Pencil design).
- **Radii:** `rounded-input` (6) inputs, `rounded-card` (8) cards, `rounded-dialog` (12) modals, `rounded-pill` badges/buttons.

## Companion docs (in the repo root)

- `lupa_people_roadmap.md` — phases, data model, decisions
- `lupa_people_user_stories.md` — US-x.y acceptance criteria (functionality spec)
- `lupa_people_design_system_tracker.md` — component + screen checklist
