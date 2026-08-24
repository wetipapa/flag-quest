import { useEffect } from "react";
import { useGame } from "../state/GameContext";
import { useSound } from "../hooks/useSound";
import { Button } from "../components/ui/Button";
import { trackReplay } from "../lib/track";
import { Card } from "../components/ui/Card";
import { FlagImage } from "../components/FlagImage";
import { Footer } from "../components/Footer";
import { getCoursePool } from "../lib/quizEngine";
import { getCountry } from "../data/countries";
import type { RoundResult } from "../types";

interface ResultScreenProps {
  result: RoundResult;
  onPlayAgain: () => void;
  onOpenPassport: () => void;
  onHome: () => void;
}

export function ResultScreen({ result, onPlayAgain, onOpenPassport, onHome }: ResultScreenProps) {
  const { state } = useGame();
  const sound = useSound();

  useEffect(() => {
    sound.fanfare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pool = getCoursePool(result.courseId);
  const visitedInPool = pool.filter((c) => state.visited[c.code]).length;
  const ratio = pool.length > 0 ? Math.round((visitedInPool / pool.length) * 100) : 0;
  const perfect = result.correctCount === result.totalQuestions;

  return (
    <div className="relative h-full flex flex-col bg-[var(--color-cream)]">
      <main className="flex-1 min-h-0 flex flex-col items-center px-5 pt-8 pb-6 gap-5 overflow-y-auto safe-top">
        <div aria-hidden="true" className="text-6xl leading-none">
          {perfect ? "🏆" : "🎒"}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[var(--color-ink)] font-[var(--font-display)]">
            {perfect ? "완벽한 여행이었어요!" : "오늘의 여행 완료!"}
          </h1>
          <p className="mt-1 font-bold text-[var(--color-ink-soft)]">
            {result.totalQuestions}개 나라 중 {result.correctCount}개를 맞혔어요
          </p>
        </div>

        <Card className="w-full max-w-sm px-5 py-4">
          <p className="mb-2 text-sm font-extrabold text-[var(--color-ink)]">이번에 방문한 나라</p>
          <div className="flex flex-wrap gap-2">
            {result.visitedCodes.map((code) => (
              <div key={code} className="flex flex-col items-center gap-1 w-14">
                <FlagImage
                  code={code}
                  label={getCountry(code).nameKo}
                  className={`w-14 h-10 rounded-lg border-2 ${
                    result.missedCodes.includes(code) ? "border-[var(--color-sun-deep)] opacity-70" : "border-[var(--color-globe)]"
                  }`}
                />
                <span className="text-[10px] font-bold text-[var(--color-ink-soft)] text-center leading-tight truncate w-full">
                  {getCountry(code).nameKo}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="w-full max-w-sm px-5 py-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-extrabold text-[var(--color-ink)]">이 코스 여행 진행률</p>
            <p className="text-sm font-black text-[var(--color-globe-deep)]">{ratio}%</p>
          </div>
          <div className="h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--color-globe)] transition-all duration-500" style={{ width: `${ratio}%` }} />
          </div>
          <p className="mt-1.5 text-xs font-bold text-[var(--color-ink-soft)]">
            {visitedInPool} / {pool.length}개 나라 방문
          </p>
        </Card>

        <div className="w-full max-w-sm flex flex-col gap-2.5 mt-1">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              trackReplay();
              onPlayAgain();
            }}
          >
            더 여행하기 ✈️
          </Button>
          <Button variant="soft" size="md" className="w-full" onClick={onOpenPassport}>
            🛂 여권 보기
          </Button>
          <Button variant="ghost" size="md" className="w-full" onClick={onHome}>
            홈으로
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
