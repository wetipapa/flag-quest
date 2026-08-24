import { CONTINENTS } from "../types";
import type { CourseId } from "../types";

const COURSES: { id: CourseId; labelKo: string; emoji: string }[] = [
  { id: "world", labelKo: "세계 전체", emoji: "🌍" },
  ...CONTINENTS,
];

export function CourseSelector({ value, onChange }: { value: CourseId; onChange: (v: CourseId) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="여행 코스 선택">
      {COURSES.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-extrabold transition-all ${
              active
                ? "bg-[var(--color-globe)] border-[var(--color-globe-deep)] text-white shadow-[0_3px_0_var(--color-globe-deep)]"
                : "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-ink)]"
            }`}
          >
            <span aria-hidden="true">{c.emoji}</span>
            {c.labelKo}
          </button>
        );
      })}
    </div>
  );
}
