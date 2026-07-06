import { cn } from "@/lib/utils";

// Mirrors the .pen ScoreChip: a 0-3 review score in a tinted, mono-numeric chip.
export type Score = 0 | 1 | 2 | 3;

const scoreClasses: Record<Score, string> = {
  0: "bg-score-0-bg text-score-0-fg",
  1: "bg-score-1-bg text-score-1-fg",
  2: "bg-score-2-bg text-score-2-fg",
  3: "bg-score-3-bg text-score-3-fg",
};

export function ScoreChip({
  score,
  className,
}: {
  score: Score;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-input font-mono text-[13px] font-bold",
        scoreClasses[score],
        className
      )}
    >
      {score}
    </span>
  );
}
