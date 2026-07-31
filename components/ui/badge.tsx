import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-zinc-700",
        critical:
          "border-red-500/40 bg-red-950/60 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        high:
          "border-amber-500/40 bg-amber-950/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        moderate:
          "border-yellow-500/30 bg-yellow-950/40 text-yellow-300",
        success:
          "border-emerald-500/40 bg-emerald-950/60 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        cyan:
          "border-cyan-500/40 bg-cyan-950/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
        purple:
          "border-purple-500/40 bg-purple-950/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
