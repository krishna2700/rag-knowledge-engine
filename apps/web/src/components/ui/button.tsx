import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "text-white",
        secondary:
          "text-slate-300 hover:text-white",
        ghost:
          "text-slate-400 hover:text-slate-200",
        danger:
          "text-white",
        outline:
          "text-slate-300 hover:text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    boxShadow: "0 0 16px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
  },
  secondary: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  ghost: {
    background: "transparent",
  },
  danger: {
    background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    boxShadow: "0 0 12px rgba(244,63,94,0.3)",
  },
  outline: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
  },
};

export const Button = ({ className, variant = "primary", size, style, ...props }: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    style={{ ...variantStyles[variant ?? "primary"], ...style }}
    {...props}
  />
);
