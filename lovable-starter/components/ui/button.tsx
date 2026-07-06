import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Mirrors the .pen Button components: Primary / Secondary / Outline / Ghost / Destructive.
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-status-neutral-bg text-foreground hover:brightness-95",
        outline: "border border-border text-foreground hover:bg-section",
        ghost: "text-body hover:bg-section",
        destructive: "bg-status-denied-fg text-primary-foreground hover:brightness-95",
      },
      size: {
        sm: "px-3 py-1.5 text-[13px]",
        md: "px-4 py-2.5 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
