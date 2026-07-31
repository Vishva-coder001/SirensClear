import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/35 border border-blue-400/30",
        glow:
          "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:brightness-110 border border-blue-400/40",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500 border border-red-400/30",
        outline:
          "border border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700",
        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/50",
        ghost:
          "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
        link: "text-blue-400 underline-offset-4 hover:underline",
        emerald:
          "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 border border-emerald-400/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base font-semibold",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
