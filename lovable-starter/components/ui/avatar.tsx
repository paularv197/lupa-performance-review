import { cn } from "@/lib/utils";

// Mirrors the .pen Avatar: initials on a tinted circle. Defaults to the info tone.
export type AvatarTone = "info" | "ai" | "approved" | "neutral";

const tones: Record<AvatarTone, string> = {
  info: "bg-status-info-bg text-status-info-fg",
  ai: "bg-status-ai-bg text-status-ai-fg",
  approved: "bg-status-approved-bg text-status-approved-fg",
  neutral: "bg-status-neutral-bg text-status-neutral-fg",
};

export function Avatar({
  initials,
  tone = "info",
  size = 40,
  className,
}: {
  initials: string;
  tone?: AvatarTone;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-pill font-bold", tones[tone], className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.35) }}
    >
      {initials}
    </span>
  );
}
