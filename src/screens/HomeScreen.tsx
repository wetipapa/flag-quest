import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StampCounter } from "../components/ui/StampCounter";
import { Footer } from "../components/Footer";
import { CourseSelector } from "../components/CourseSelector";
import { DifficultySelector } from "../components/DifficultySelector";
import { COUNTRIES } from "../data/countries";
import { playTap, unlockAudio } from "../lib/audio";
import heroImage from "../assets/hero-boy-globe.png";
import type { CourseId, Difficulty } from "../types";

interface HomeScreenProps {
  onStart: (course: CourseId, difficulty: Difficulty) => void;
  onOpenPassport: () => void;
  onOpenSettings: () => void;
}

export function HomeScreen({ onStart, onOpenPassport, onOpenSettings }: HomeScreenProps) {
  const { state, dispatch } = useGame();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const stampCount = Object.keys(state.visited).length;
  const mistakeCount = state.mistakeQueue.length;

  const handleStart = () => {
    unlockAudio();
    playTap();
    onStart(state.settings.course, state.settings.difficulty);
  };

  const handleReviewMistakes = () => {
    unlockAudio();
    playTap();
    onStart(state.settings.course, state.settings.difficulty);
  };

  return (
    <div className="relative h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={() => {
            playTap();
            onOpenSettings();
          }}
          aria-label="설정 열기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[var(--color-border)] shadow-[0_3px_0_var(--color-border)] active:translate-y-0.5"
        >
          <span aria-hidden="true" className="text-lg">
            ⚙️
          </span>
        </button>
        <StampCounter
          count={stampCount}
          onClick={() => {
            playTap();
            onOpenPassport();
          }}
        />
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center px-5 pt-4 pb-6 gap-5 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[var(--color-ink)] font-[var(--font-display)]">국기 콕콕</h1>
          <p className="mt-1 text-sm font-bold text-[var(--color-ink-soft)]">국기를 콕! 맞히며 떠나는 세계여행</p>
        </div>

        <img
          src={heroImage}
          alt="여권과 세계지도를 든 아이 캐릭터가 일본, 프랑스, 독일, 나이지리아 국기와 비행기에 둘러싸여 웃고 있는 그림"
          className="w-full max-w-[220px] h-auto select-none"
          draggable={false}
        />

        <Button variant="primary" size="lg" className="w-full max-w-sm text-2xl" onClick={handleStart} aria-label="여행 떠나기, 바로 시작">
          여행 떠나기 🎈
        </Button>

        {mistakeCount > 0 && (
          <button
            type="button"
            onClick={handleReviewMistakes}
            className="text-sm font-extrabold text-[var(--color-sky-deep)] underline underline-offset-2"
          >
            틀렸던 나라 {mistakeCount}개 다시 도전하기
          </button>
        )}

        <Card className="w-full max-w-sm px-4 py-3">
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 text-center font-extrabold text-[var(--color-ink)]"
            aria-expanded={detailsOpen}
          >
            <span>여행 코스 · 난이도 설정</span>
            <span aria-hidden="true" className={`transition-transform ${detailsOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {detailsOpen && (
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <p className="mb-2 text-xs font-extrabold text-[var(--color-ink-soft)]">어디로 떠날까요?</p>
                <CourseSelector value={state.settings.course} onChange={(course) => dispatch({ type: "SET_COURSE", course })} />
              </div>
              <div>
                <p className="mb-2 text-xs font-extrabold text-[var(--color-ink-soft)]">얼마나 어렵게 할까요?</p>
                <DifficultySelector
                  value={state.settings.difficulty}
                  onChange={(difficulty) => dispatch({ type: "SET_DIFFICULTY", difficulty })}
                />
              </div>
            </div>
          )}
        </Card>

        <button
          type="button"
          onClick={() => {
            playTap();
            onOpenPassport();
          }}
          className="w-full max-w-sm flex items-center justify-center gap-2 rounded-full bg-[var(--color-card)] border-2 border-[var(--color-border)] px-6 py-3 font-extrabold text-[var(--color-ink)] shadow-[0_4px_0_var(--color-border)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-border)]"
        >
          🛂 내 여권 보기
          <span className="text-xs font-bold text-[var(--color-ink-soft)]">
            {stampCount}/{COUNTRIES.length}
          </span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
