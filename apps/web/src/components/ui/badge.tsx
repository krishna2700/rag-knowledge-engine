import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-white/8 text-slate-300 border border-white/10",
        success:    "text-emerald-400 border border-emerald-500/25",
        warning:    "text-amber-400 border border-amber-500/25",
        danger:     "text-rose-400 border border-rose-500/25",
        processing: "text-sky-400 border border-sky-500/25",
        outline:    "border border-white/15 text-slate-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const badgeInlineStyles: Record<string, React.CSSProperties> = {
  default:    { background: "rgba(255,255,255,0.06)" },
  success:    { background: "rgba(16,185,129,0.12)" },
  warning:    { background: "rgba(245,158,11,0.12)" },
  danger:     { background: "rgba(244,63,94,0.12)" },
  processing: { background: "rgba(56,189,248,0.12)" },
  outline:    { background: "transparent" },
};

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant = "default", style, ...props }: BadgeProps) => (
  <span
    className={cn(badgeVariants({ variant }), className)}
    style={{ ...badgeInlineStyles[variant ?? "default"], ...style }}
    {...props}
  />
);
