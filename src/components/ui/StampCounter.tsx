interface StampCounterProps {
  count: number;
  className?: string;
  /** 주어지면 버튼으로 렌더링되어 눌렀을 때 이 함수를 호출한다 (예: 여권 화면 열기) */
  onClick?: () => void;
}

const baseClass =
  "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-card)] border-2 border-[var(--color-gold)] px-3.5 py-1.5 font-extrabold text-[var(--color-gold-deep)] shadow-[0_3px_0_var(--color-border)]";

/** 여권에 찍힌 도장(=방문한 나라) 개수를 보여주는 배지. onClick을 주면 여권으로 이동하는 버튼이 된다 */
export function StampCounter({ count, className, onClick }: StampCounterProps) {
  const content = (
    <>
      <span aria-hidden="true" className="text-lg leading-none">
        🛂
      </span>
      <span className="text-lg tabular-nums">{count}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`방문한 나라 ${count}개, 여권 보기`}
        className={`${baseClass} active:translate-y-0.5 active:shadow-none ${className ?? ""}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${baseClass} ${className ?? ""}`} role="status" aria-label={`방문한 나라 ${count}개`}>
      {content}
    </div>
  );
}
