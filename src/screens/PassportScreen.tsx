import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Button } from "../components/ui/Button";
import { FlagImage } from "../components/FlagImage";
import { Footer } from "../components/Footer";
import { CountryInfoCard } from "../components/CountryInfoCard";
import { CONTINENTS } from "../types";
import type { CourseId } from "../types";
import { getCoursePool } from "../lib/quizEngine";
import { getCountry } from "../data/countries";
import { playTap } from "../lib/audio";

interface PassportScreenProps {
  onBack: () => void;
  onReviewMistakes: () => void;
}

const TABS: { id: CourseId; labelKo: string; emoji: string }[] = [{ id: "world", labelKo: "전체", emoji: "🌍" }, ...CONTINENTS];

export function PassportScreen({ onBack, onReviewMistakes }: PassportScreenProps) {
  const { state } = useGame();
  const [tab, setTab] = useState<CourseId>("world");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const pool = getCoursePool(tab);
  const visitedCount = pool.filter((c) => state.visited[c.code]).length;
  const ratio = pool.length > 0 ? Math.round((visitedCount / pool.length) * 100) : 0;

  return (
    <div className="relative h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center gap-3 px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={() => {
            playTap();
            onBack();
          }}
          aria-label="뒤로 가기"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[var(--color-border)] shadow-[0_3px_0_var(--color-border)] active:translate-y-0.5 shrink-0"
        >
          <span aria-hidden="true">←</span>
        </button>
        <h1 className="text-xl font-black text-[var(--color-ink)] font-[var(--font-display)]">🛂 내 여권</h1>
      </header>

      <div className="px-4 pt-3">
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-extrabold border-2 transition-all ${
                  active
                    ? "bg-[var(--color-globe)] border-[var(--color-globe-deep)] text-white"
                    : "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-ink)]"
                }`}
              >
                {t.emoji} {t.labelKo}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-extrabold text-[var(--color-ink-soft)]">
            {visitedCount} / {pool.length}개 나라 방문
          </p>
          <p className="text-xs font-black text-[var(--color-globe-deep)]">{ratio}%</p>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-globe)] transition-all duration-500" style={{ width: `${ratio}%` }} />
        </div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {state.mistakeQueue.length > 0 && (
          <Button variant="secondary" size="sm" className="w-full mb-4" onClick={onReviewMistakes}>
            틀렸던 나라 {state.mistakeQueue.length}개 다시 도전하기
          </Button>
        )}

        <div className="grid grid-cols-3 gap-3">
          {pool.map((country) => {
            const visited = !!state.visited[country.code];
            return (
              <button
                key={country.code}
                type="button"
                disabled={!visited}
                onClick={() => {
                  playTap();
                  setSelectedCode(country.code);
                }}
                aria-label={visited ? `${country.nameKo} 정보 보기` : "아직 방문하지 않은 나라"}
                className="flex flex-col items-center gap-1 disabled:cursor-default"
              >
                <div className="relative w-full">
                  <FlagImage
                    code={country.code}
                    label={visited ? country.nameKo : "아직 방문하지 않은 나라"}
                    className={`w-full aspect-[4/3] rounded-xl border-2 transition-transform ${
                      visited ? "border-[var(--color-globe)] active:scale-95" : "border-[var(--color-border)] grayscale opacity-35"
                    }`}
                  />
                  {visited && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-gold)] text-xs border-2 border-white shadow"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight ${visited ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"}`}>
                  {visited ? country.nameKo : "???"}
                </span>
              </button>
            );
          })}
        </div>
      </main>
      <Footer />

      {selectedCode && (
        <div
          className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-ink)]/30 backdrop-blur-[2px] p-3"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto flex flex-col gap-3 rounded-[28px] bg-[var(--color-card)] p-5 border-4 border-[var(--color-gold)] shadow-2xl animate-[pop-in_0.3s_ease-out]">
            <button
              type="button"
              onClick={() => {
                playTap();
                setSelectedCode(null);
              }}
              aria-label="닫기"
              className="absolute top-4 right-4 flex items-center justify-center h-9 w-9 rounded-full bg-[var(--color-cream)] border-2 border-[var(--color-border)]"
            >
              ✕
            </button>
            <CountryInfoCard country={getCountry(selectedCode)} />
          </div>
        </div>
      )}
    </div>
  );
}
