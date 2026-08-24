import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-[28px] bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-[0_8px_0_var(--color-border)] ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
