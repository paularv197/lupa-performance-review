import Link from "next/link";
import { AppShell } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ScoreChip } from "@/components/ui/score-chip";
import { FunctionBadge, TierBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Starter landing: proves the design tokens + primitives render on-brand.
// Replace with the real "My Profile" home (US-0.5) when building in Lovable.
export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <header className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-foreground">Lupa People — starter</h1>
          <p className="max-w-2xl text-sm text-body">
            This scaffold wires the exact Lupa design tokens (light mode, Manrope, <code>#00483B</code>) into
            Tailwind, plus the reusable primitives from the Pencil design. Build the real pages on top of these,
            slice by slice, using the prompt pack in <code>LOVABLE_SCREENS.md</code>.
          </p>
          <Link href="/level-up" className="text-sm font-semibold text-primary underline">
            → See an example screen (Level Up)
          </Link>
        </header>

        <Card className="flex flex-col gap-5 p-6">
          <h2 className="text-base font-bold text-foreground">Primitives</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="approved">Approved</StatusPill>
            <StatusPill tone="info">In progress</StatusPill>
            <StatusPill tone="pending">Pending</StatusPill>
            <StatusPill tone="denied">Denied</StatusPill>
            <StatusPill tone="neutral">Draft</StatusPill>
            <StatusPill tone="ai" dot={false}>
              AI-checked
            </StatusPill>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ScoreChip score={0} />
            <ScoreChip score={1} />
            <ScoreChip score={2} />
            <ScoreChip score={3} />
            <FunctionBadge>Product Ops</FunctionBadge>
            <TierBadge>Senior</TierBadge>
            <Avatar initials="PA" />
            <Avatar initials="DF" tone="ai" />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
