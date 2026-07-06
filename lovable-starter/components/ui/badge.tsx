import { cn } from "@/lib/utils";

// Mirrors the .pen Badge/Function (primary-tint) and Badge/Tier (outlined).
export function FunctionBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-pill bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary", className)}>
      {children}
    </span>
  );
}

export function TierBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-pill border border-border px-2.5 py-1 text-xs font-semibold text-body", className)}>
      {children}
    </span>
  );
}
