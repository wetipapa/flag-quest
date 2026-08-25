import type { Country } from "../../types";
import { FlagImage } from "../FlagImage";
import { CountryInfoCard } from "../CountryInfoCard";
import { Button } from "../ui/Button";

interface ReviewQuestionCardProps {
  target: Country;
  result: "correct" | "wrong" | undefined;
  onReturn: () => void;
}

/**
 * 왼쪽 스와이프로 되돌아본 "이미 지나온" 문제를 보여주는 읽기 전용 화면.
 * 정답을 다시 고를 순 없고(이미 채점이 끝났다), 그 나라 정보만 한 번 더 보여준다.
 * 실제 라이브 문제는 index로 그대로 유지되므로 여기서 답을 바꿀 방법 자체가 없다.
 */
export function ReviewQuestionCard({ target, result, onReturn }: ReviewQuestionCardProps) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center gap-4 px-5 pt-6 pb-6">
      <span className="rounded-full bg-[var(--color-card-soft)] text-[var(--color-ink-soft)] text-xs font-extrabold px-3 py-1">
        {result === "correct" ? "✅ 맞혔던 나라" : "🌱 함께 배웠던 나라"} · 다시 보기
      </span>

      <FlagImage
        code={target.code}
        decorative
        className="w-full max-w-[220px] aspect-[4/3] rounded-3xl border-4 border-white shadow-[0_10px_24px_rgba(51,36,28,0.18)]"
      />

      <CountryInfoCard country={target} />

      <Button variant="primary" size="md" className="w-full max-w-sm mt-1" onClick={onReturn}>
        이어서 하기 →
      </Button>
    </div>
  );
}
