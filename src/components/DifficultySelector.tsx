import { DIFFICULTY_ORDER, DIFFICULTIES } from "../lib/difficulty";
import type { Difficulty } from "../types";

export function DifficultySelector({ value, onChange }: { value: Difficulty; onChange: (v: Difficulty) => void }) {
  return (
    <div>
      <div className="flex rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-1" role="radiogroup" aria-label="난이도 선택">
        {DIFFICULTY_ORDER.map((id) => {
          const active = id === value;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={`flex-1 rounded-xl py-2 text-sm font-extrabold transition-all ${
                active ? "bg-[var(--color-sun)] text-white shadow-[0_2px_0_var(--color-sun-deep)]" : "text-[var(--color-ink-soft)]"
              }`}
            >
              {DIFFICULTIES[id].labelKo}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs font-bold text-[var(--color-ink-soft)] text-center">{DIFFICULTIES[value].descriptionKo}</p>
    </div>
  );
}
