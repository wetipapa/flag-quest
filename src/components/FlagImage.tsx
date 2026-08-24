import { getFlagUrl } from "../lib/flagAssets";

interface FlagImageProps {
  code: string;
  className?: string;
  label?: string;
  /** true면 순수 장식(보기 버튼 안의 작은 국기 등)이라 스크린리더에서 숨긴다 */
  decorative?: boolean;
}

/**
 * 국기 이미지 렌더러. 이모지 국기는 기기·브라우저마다 다르게 보이거나 아예 안 보일 수 있어
 * 사용하지 않고, 어떤 기기에서도 동일하게 보이는 벡터 국기(flag-icons, 4:3 SVG)를 직접 <img>로
 * 그린다. 각 국기는 실제로 화면에 나타날 때만 브라우저가 내려받는다(불필요한 사전 로딩 없음).
 */
export function FlagImage({ code, className, label, decorative = false }: FlagImageProps) {
  const url = getFlagUrl(code);

  return (
    <span className={`overflow-hidden inline-block bg-[var(--color-border)] ${className ?? ""}`} aria-hidden={decorative || undefined}>
      {url && (
        <img
          src={url}
          alt={decorative ? "" : (label ?? "")}
          className="w-full h-full object-cover block"
          draggable={false}
          loading="lazy"
        />
      )}
    </span>
  );
}
