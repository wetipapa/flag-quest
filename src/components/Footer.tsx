/** 브랜드 가이드 §7 규칙: Footer에는 항상 'WETI PLAY by 웨티아빠' 표기를 남긴다 */
export function Footer() {
  return (
    <footer className="px-4 py-4 text-center safe-bottom">
      <p className="text-xs font-bold text-[var(--color-ink-soft)]">
        <span className="inline-flex items-center gap-1">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-sun)] text-white text-[9px]"
          >
            ✦
          </span>
          WETI PLAY
        </span>{" "}
        by 웨티아빠
      </p>
    </footer>
  );
}
