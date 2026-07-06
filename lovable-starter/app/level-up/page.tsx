import { ArrowRight, Play, Clock, AlertTriangle, CheckCircle2, RotateCcw, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";

// Example screen generated from the Pencil frame "Screen / Level Up" (QEp7y).
// Static mock data — in the real app this comes from Supabase (enrollments + lesson_progress).

type Course = {
  title: string;
  meta: string;
  status: { label: string; tone: StatusTone };
  pct: number;
  progress: string;
  pace?: { label: string; tone: StatusTone };
  due: string;
  dueBehind?: boolean;
  cta: string;
  ctaIcon: "arrow" | "play";
};

const keepGoing: Course[] = [
  {
    title: "New Hire Onboarding",
    meta: "5 lessons · 3-day plan",
    status: { label: "In progress", tone: "info" },
    pct: 60,
    progress: "Day 2 of 3 · 3 of 5 lessons",
    pace: { label: "On track", tone: "approved" },
    due: "Due in 2 days",
    cta: "Continue",
    ctaIcon: "arrow",
  },
  {
    title: "Product Ops Fundamentals",
    meta: "8 lessons · 4-day plan",
    status: { label: "In progress", tone: "info" },
    pct: 13,
    progress: "Day 1 of 4 · 1 of 8 lessons",
    pace: { label: "Behind by 1 day", tone: "pending" },
    due: "Due in 3 days",
    dueBehind: true,
    cta: "Continue",
    ctaIcon: "arrow",
  },
];

const notStarted: Course[] = [
  {
    title: "Security & Compliance",
    meta: "4 lessons · 2-day plan",
    status: { label: "Not started", tone: "neutral" },
    pct: 0,
    progress: "0 of 4 lessons",
    due: "Due in 5 days",
    cta: "Start course",
    ctaIcon: "play",
  },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-input bg-primary-tint text-primary">
          <GraduationCap className="h-[22px] w-[22px]" />
        </span>
        <StatusPill tone={course.status.tone} dot={false}>
          {course.status.label}
        </StatusPill>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-foreground">{course.title}</h3>
        <p className="text-xs text-muted-foreground">{course.meta}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-2 w-full overflow-hidden rounded-pill bg-section">
          <div className="h-2 rounded-pill bg-primary" style={{ width: `${course.pct}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-body">{course.progress}</span>
          {course.pace && (
            <StatusPill tone={course.pace.tone} dot={false}>
              {course.pace.label}
            </StatusPill>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
            course.dueBehind ? "text-status-pending-fg" : "text-muted-foreground"
          }`}
        >
          {course.dueBehind ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
          {course.due}
        </span>
        <Button size="sm">
          {course.ctaIcon === "play" ? <Play className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
          {course.cta}
        </Button>
      </div>
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-wide text-muted-foreground">{children}</p>;
}

export default function LevelUpPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <header className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-foreground">Level Up</h1>
          <p className="text-sm text-body">
            Your assigned courses. Keep up with your daily plan to stay on track.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <SectionLabel>KEEP GOING</SectionLabel>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {keepGoing.map((c) => (
              <CourseCard key={c.title} course={c} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel>NOT STARTED</SectionLabel>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {notStarted.map((c) => (
              <CourseCard key={c.title} course={c} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel>COMPLETED</SectionLabel>
          <Card className="flex items-center gap-3.5 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-input bg-status-approved-bg text-status-approved-fg">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-[15px] font-bold text-foreground">Slack &amp; Tools Basics</span>
              <span className="text-xs text-muted-foreground">Completed 24 Jun 2026 · Quiz score 95%</span>
            </div>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-3.5 w-3.5" />
              Review
            </Button>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
