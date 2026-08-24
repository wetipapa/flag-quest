type OptionState = "idle" | "selected-wrong" | "reveal-correct" | "disabled";

interface OptionButtonProps {
  label: string;
  state: OptionState;
  onClick: () => void;
}

export function OptionButton({ label, state, onClick }: OptionButtonProps) {
  const isInteractive = state === "idle";

  const stateClasses: Record<OptionState, string> = {
    idle: "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-ink)] shadow-[0_4px_0_var(--color-border)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-border)]",
    "selected-wrong": "bg-[#ffe3dc] border-[var(--color-sun-deep)] text-[var(--color-sun-deep)] shadow-none animate-[shake_0.4s_ease-in-out]",
    "reveal-correct": "bg-[var(--color-globe-tint)] border-[var(--color-globe)] text-[var(--color-globe-ink)] shadow-none",
    disabled: "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-ink-soft)] opacity-60 shadow-none",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={`w-full min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-base font-extrabold transition-all duration-150 font-[var(--font-body)] ${stateClasses[state]}`}
    >
      {label}
      {state === "reveal-correct" && <span className="ml-2" aria-hidden="true">✅</span>}
      {state === "selected-wrong" && <span className="ml-2" aria-hidden="true">❌</span>}
    </button>
  );
}
