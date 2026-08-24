const HUB_URL = "https://play.wetipapa.com";
const BLOG_URL = "https://blog.naver.com/wetipapa";

/**
 * 첫 화면 맨 아래와 결과·완료 화면에 두는 두 줄짜리 링크.
 *
 * 다섯 서비스가 **같은 문구와 같은 자리**를 쓴다 (WTPP 공통 규칙).
 * 서비스마다 다르게 쓰면 같은 곳으로 가는 링크로 안 읽힌다.
 * 구현 기준은 theo-math-pop의 `HubLink` / `BlogLink`.
 *
 * 게임 중에는 넣지 않는다 — 눈에 띄면 한 판을 끝내기 전에 빠져나간다.
 * 아이가 보는 화면에서 링크는 허브와 블로그 둘이 끝이다.
 */
export function Footer() {
  return (
    <footer className="px-4 pt-2 pb-4 text-center safe-bottom">
      <p className="text-center text-xs font-bold text-[var(--color-ink-soft)]">
        <a
          href={HUB_URL}
          className="underline decoration-2 underline-offset-4 hover:text-[var(--color-ink)]"
        >
          WTPP PLAY
        </a>
        에서 다른 게임도 만나보세요
      </p>

      {/* 한 줄로 두면 좁은 폰에서 어중간한 자리에 접힌다. 의미 단위로 끊어 두 줄로 고정한다 */}
      <p className="mt-1.5 text-center text-xs font-bold leading-relaxed text-[var(--color-ink-soft)]">
        <span className="block">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-4 hover:text-[var(--color-ink)]"
          >
            ✍️ 웨티파파 블로그
          </a>
          에서
        </span>
        <span className="block">아들 웨티와 함께하는 소소한 일상을 만나요</span>
      </p>
    </footer>
  );
}
