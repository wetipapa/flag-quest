const HUB_URL = "https://play.wetipapa.com";
const BLOG_URL = "https://blog.naver.com/wetipapa";

/**
 * 브랜드 가이드 §7 규칙: Footer에는 항상 'WETI PLAY by 웨티아빠' 표기를 남긴다.
 * 여기에 더해 WETI PLAY 허브(다른 게임)와 웨티아빠 블로그로 가는 연결 링크를 둔다 —
 * 이 게임이 단독으로 따로 노는 게 아니라 WETI PLAY 가족의 일부라는 걸 보여준다.
 */
export function Footer() {
  return (
    <footer className="px-4 py-4 text-center safe-bottom">
      <nav className="flex flex-col items-center gap-1.5 mb-3" aria-label="다른 콘텐츠">
        <a
          href={HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[var(--color-globe)] underline underline-offset-2"
        >
          WETI PLAY에서 다른 게임도 만나보세요
        </a>
        <a
          href={BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[var(--color-ink-soft)] underline underline-offset-2"
        >
          ✍️ 웨티파파 블로그에서 아들 웨티와 함께하는 소소한 일상을 만나요
        </a>
      </nav>

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
