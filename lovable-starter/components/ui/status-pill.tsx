import { cn } from "@/lib/utils";

// Mirrors the .pen StatusPill: a dot + label on a tinted pill.
export type StatusTone =
  | "approved"
  | "info"
  | "pending"
  | "denied"
  | "neutral"
  | "ai";

const tones: Record<StatusTone, { bg: string; fg: string }> = {
  approved: { bg: "bg-status-approved-bg", fg: "text-status-approved-fg" },
  info: { bg: "bg-status-info-bg", fg: "text-status-info-fg" },
  pending: { bg: "bg-status-pending-bg", fg: "text-status-pending-fg" },
  denied: { bg: "bg-status-denied-bg", fg: "text-status-denied-fg" },
  neutral: { bg: "bg-status-neutral-bg", fg: "text-status-neutral-fg" },
  ai: { bg: "bg-status-ai-bg", fg: "text-status-ai-fg" },
};

export function StatusPill({
  children,
  tone = "approved",
  dot = true,
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold",
        t.bg,
        t.fg,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-pill", t.fg.replace("text-", "bg-"))} />}
      {children}
    </span>
  );
}
