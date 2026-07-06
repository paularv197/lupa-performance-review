"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors the .pen NavItem/Active + NavItem/Default.
export function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-input px-3.5 py-2.5 text-sm transition-colors",
        active
          ? "bg-primary-tint font-semibold text-primary"
          : "font-medium text-body hover:bg-section"
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </Link>
  );
}

export function NavSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 py-2 text-[11px] font-bold tracking-[0.6px] text-muted-foreground">
      {children}
    </p>
  );
}
