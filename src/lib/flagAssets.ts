/**
 * 국기 SVG 자산 매핑.
 *
 * flag-icons가 제공하는 완성된 CSS(`flag-icons.min.css`)를 그대로 쓰면 195개국 국기가
 * 모두 하나의 스타일시트에 url() 참조로 들어가고, Vite가 작은 SVG는 base64로 인라인해버려
 * 초기 CSS 번들이 수백 KB까지 부풀어 오른다(모바일 로딩 속도에 불리하다).
 *
 * 대신 `import.meta.glob`으로 개별 SVG 파일의 최종 URL만 미리 계산해두고,
 * 실제 바이트는 각 <img>가 화면에 그려질 때 브라우저가 필요한 만큼만 내려받게 한다.
 */
const modules = import.meta.glob("/node_modules/flag-icons/flags/4x3/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const flagUrlByCode: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const code = path.split("/").pop()?.replace(".svg", "");
  if (code) flagUrlByCode[code] = url;
}

export function getFlagUrl(code: string): string | undefined {
  return flagUrlByCode[code];
}
