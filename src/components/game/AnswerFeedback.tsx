import type { Country } from "../../types";
import { Confetti } from "../ui/Confetti";
import { CountryInfoCard } from "../CountryInfoCard";
import { Button } from "../ui/Button";

interface AnswerFeedbackProps {
  result: "correct" | "wrong";
  country: Country;
  reduceMotion: boolean;
  onNext: () => void;
}

/**
 * 정답/오답 뒤에 뜨는 피드백 오버레이.
 * 정답이면 비행기가 나라로 이동하고 여권에 도장이 찍히는 짧은 연출 + 국가 정보 카드.
 * 오답(2번 다 틀려 정답을 공개한 경우)이면 다그치지 않고 바로 국가 정보 카드로 안내한다.
 * 자동으로 넘어가지 않고, 아이가 정보를 다 읽은 뒤 직접 "다음 나라로"를 눌러야 다음 문제로 간다.
 */
export function AnswerFeedback({ result, country, reduceMotion, onNext }: AnswerFeedbackProps) {
  const isCorrect = result === "correct";

  return (
    <div
      className="absolute inset-0 z-40 flex items-end sm:items-center justify-center bg-[var(--color-ink)]/30 backdrop-blur-[2px] p-3"
      role="status"
      aria-live="polite"
    >
      {isCorrect && <Confetti active reduceMotion={reduceMotion} />}

      <div
        className={`relative flex w-full max-w-sm max-h-[85vh] flex-col rounded-[28px] bg-[var(--color-card)] px-5 pb-5 pt-7 border-4 ${
          isCorrect ? "border-[var(--color-gold)]" : "border-[var(--color-sky)]"
        } shadow-2xl ${reduceMotion ? "" : "animate-[pop-in_0.35s_ease-out]"}`}
      >
        {/* 넘치는 것은 이 안쪽만 스크롤한다. `다음 나라로`는 카드 바닥에 그대로 남는다 —
            iPhone SE처럼 짧은 화면에서 버튼이 화면 밖으로 밀려나면 아이는 갇힌 것처럼 느낀다 */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {isCorrect ? (
          <div className="relative flex flex-col items-center gap-1 pb-1">
            {/* 비행기가 지나가는 길. 제목과 겹치지 않게 위에 따로 띄우고,
                양 끝에서 완전히 사라지도록 넉넉히 잘라 둔다 */}
            <div className="relative h-12 w-full overflow-hidden">
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 text-3xl ${
                  reduceMotion
                    ? "-translate-x-1/2 -translate-y-1/2 opacity-0"
                    : "animate-[plane-fly_1.2s_ease-in-out_forwards]"
                }`}
              >
                ✈️
              </span>
            </div>
            <p className="text-xl font-black text-[var(--color-globe-deep)] font-[var(--font-display)]">정답이에요! 🎉</p>
            <p className="text-sm font-bold text-[var(--color-ink-soft)]">여권에 도장을 쾅 찍었어요</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 pb-1 text-center">
            <p className="text-xl font-black text-[var(--color-sky-deep)] font-[var(--font-display)]">괜찮아요! 함께 알아봐요</p>
            <p className="text-sm font-bold text-[var(--color-ink-soft)]">이 나라는 조금 있다가 다시 만나요</p>
          </div>
        )}

          <CountryInfoCard country={country} />
        </div>

        <Button variant={isCorrect ? "primary" : "secondary"} size="md" className="mt-3 w-full shrink-0" onClick={onNext}>
          다음 나라로 →
        </Button>
      </div>
    </div>
  );
}
