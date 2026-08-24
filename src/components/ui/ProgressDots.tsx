interface ProgressDotsProps {
  total: number;
  current: number;
  results: ("correct" | "wrong" | undefined)[];
}

/** 이번 판의 문제 진행 상황을 점으로 보여준다 */
export function ProgressDots({ total, current, results }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" role="status" aria-label={`${total}문제 중 ${current + 1}번째`}>
      {Array.from({ length: total }, (_, i) => {
        const result = results[i];
        const isCurrent = i === current;
        const base = "h-2.5 rounded-full transition-all duration-300";
        if (result === "correct") return <span key={i} className={`${base} w-2.5 bg-[var(--color-globe)]`} />;
        if (result === "wrong") return <span key={i} className={`${base} w-2.5 bg-[var(--color-sun-deep)]`} />;
        if (isCurrent) return <span key={i} className={`${base} w-6 bg-[var(--color-sun)]`} />;
        return <span key={i} className={`${base} w-2.5 bg-[var(--color-border)]`} />;
      })}
    </div>
  );
}
