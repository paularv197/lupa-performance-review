"use client";

import { usePathname } from "next/navigation";
import {
  User,
  Calendar,
  ClipboardList,
  Rocket,
  Network,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { NavItem, NavSectionTitle } from "./nav-item";
import { Avatar } from "@/components/ui/avatar";

// Mirrors the .pen Sidebar: brand, ME + COMPANY sections, user footer.
// `Dashboards` is admin-gated in the real app (role check) — shown here for reference.
const nav = {
  me: [
    { icon: User, label: "My Profile", href: "/" },
    { icon: Calendar, label: "Time Off", href: "/time-off" },
    { icon: ClipboardList, label: "My Reviews", href: "/reviews" },
    { icon: Rocket, label: "Level Up", href: "/level-up" },
  ],
  company: [
    { icon: Network, label: "Org Chart", href: "/org" },
    { icon: Users, label: "People", href: "/people" },
    { icon: LayoutDashboard, label: "Dashboards", href: "/dashboards" },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col gap-1.5 border-r border-border bg-card p-4">
      <div className="flex items-center gap-2.5 p-1.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-input bg-primary font-bold text-primary-foreground">
          L
        </span>
        <span className="font-bold text-foreground">Lupa People</span>
      </div>

      <div className="h-2.5" />
      <NavSectionTitle>ME</NavSectionTitle>
      {nav.me.map((item) => (
        <NavItem key={item.href} {...item} active={isActive(item.href)} />
      ))}

      <div className="h-2.5" />
      <NavSectionTitle>COMPANY</NavSectionTitle>
      {nav.company.map((item) => (
        <NavItem key={item.href} {...item} active={isActive(item.href)} />
      ))}

      <div className="mt-auto flex items-center gap-2.5 border-t border-border px-1.5 py-3">
        <Avatar initials="PA" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Paula Álvarez</span>
          <span className="text-xs text-muted-foreground">Product Ops · Senior</span>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
