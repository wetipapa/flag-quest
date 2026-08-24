import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft" | "ghost";
type Size = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-sun)] text-white shadow-[0_6px_0_var(--color-sun-deep)] active:shadow-[0_2px_0_var(--color-sun-deep)] active:translate-y-1 border-2 border-[#ffb85c]",
  secondary:
    "bg-[var(--color-globe)] text-white shadow-[0_6px_0_var(--color-globe-deep)] active:shadow-[0_2px_0_var(--color-globe-deep)] active:translate-y-1 border-2 border-[#3fb083]",
  soft: "bg-[var(--color-card)] text-[var(--color-ink)] shadow-[0_4px_0_var(--color-border)] active:shadow-[0_1px_0_var(--color-border)] active:translate-y-1 border-2 border-[var(--color-border)]",
  ghost: "bg-transparent text-[var(--color-ink-soft)] hover:bg-black/5",
};

const SIZE_CLASSES: Record<Size, string> = {
  lg: "min-h-16 px-8 text-xl rounded-3xl gap-2.5",
  md: "min-h-14 px-6 text-lg rounded-2xl gap-2",
  sm: "min-h-11 px-4 text-sm rounded-xl gap-1.5",
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center font-extrabold transition-transform duration-150 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] font-[var(--font-display)] ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
