import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { CourseSelector } from "../components/CourseSelector";
import { DifficultySelector } from "../components/DifficultySelector";
import { COUNTRIES } from "../data/countries";
import { playTap, unlockAudio } from "../lib/audio";
import { trackStart } from "../lib/track";
import heroImage from "../assets/hero-boy-globe.png";
import type { CourseId, Difficulty } from "../types";

interface HomeScreenProps {
  onStart: (course: CourseId, difficulty: Difficulty) => void;
  onOpenPassport: () => void;
  onReviewMistakes: () => void;
}

type Panel = "settings" | "how" | null;

/**
 * 첫 화면. 골격은 WTPP 공통 표준(기준은 theo-math-pop의 `HomeScreen`)을 그대로 따른다.
 *
 *   그림 → 서비스명 → 한 줄 설명 → 바로 시작 → 보조 한 줄 → [설정 바꾸기][게임 방법] → 링크
 *
 * 다섯 서비스가 같은 골격을 써야 아이가 다른 게임에 들어갈 때 다시 배우지 않는다.
 * 제목·주 버튼·보조 버튼에는 이모지를 붙이지 않고, 보조 버튼은 한 번에 하나만 펼친다
 * (둘 다 열리면 화면이 길어져 `바로 시작`이 밀려난다).
 *
 * 설정은 따로 뜨는 창이 아니라 여기서 접었다 펴는 자리에 둔다 — 다른 서비스가 전부 그렇다.
 */
export function HomeScreen({ onStart, onOpenPassport, onReviewMistakes }: HomeScreenProps) {
  const { state, dispatch } = useGame();
  const [panel, setPanel] = useState<Panel>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  const stampCount = Object.keys(state.visited).length;
  const mistakeCount = state.mistakeQueue.length;

  const handleStart = () => {
    // 첫 터치에서 오디오를 깨운다 (모바일 자동재생 정책)
    unlockAudio();
    playTap();
    trackStart();
    onStart(state.settings.course, state.settings.difficulty);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto bg-[var(--color-cream)] px-5 py-6 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-2">
        {/* 한 컷으로 무슨 게임인지 보여주는 자리. 로고가 아니라 콘텐츠다 */}
        <img
          src={heroImage}
          alt="여권과 세계지도를 든 아이 캐릭터가 일본, 프랑스, 독일, 나이지리아 국기와 비행기에 둘러싸여 웃고 있는 그림"
          className="h-[20vh] max-h-44 w-auto select-none"
          draggable={false}
        />
        <h1 className="font-[var(--font-display)] text-3xl font-black text-[var(--color-ink)]">국기 콕콕</h1>
        <p className="text-center text-sm font-bold text-[var(--color-ink-soft)]">
          국기를 콕! 맞히며 떠나는 세계여행
        </p>
      </div>

      <Button variant="primary" size="lg" className="w-full max-w-xs" onClick={handleStart} aria-label="바로 시작">
        바로 시작
      </Button>

      {stampCount > 0 && (
        <p className="-mt-2 text-xs font-bold text-[var(--color-ink-soft)]">
          모은 도장 {stampCount}개
          {mistakeCount > 0 && ` · 틀렸던 나라 ${mistakeCount}개`}
        </p>
      )}

      <div className="flex w-full max-w-xs flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="soft"
            size="sm"
            className="flex-1"
            aria-expanded={panel === "settings"}
            onClick={() => toggle("settings")}
          >
            설정 바꾸기 {panel === "settings" ? "▴" : "▾"}
          </Button>
          <Button
            variant="soft"
            size="sm"
            className="flex-1"
            aria-expanded={panel === "how"}
            onClick={() => toggle("how")}
          >
            게임 방법 {panel === "how" ? "▴" : "▾"}
          </Button>
        </div>

        {panel === "settings" && (
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-[var(--color-ink-soft)]">어디로 떠날까요?</span>
              <CourseSelector
                value={state.settings.course}
                onChange={(course) => dispatch({ type: "SET_COURSE", course })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-[var(--color-ink-soft)]">얼마나 어렵게 할까요?</span>
              <DifficultySelector
                value={state.settings.difficulty}
                onChange={(difficulty) => dispatch({ type: "SET_DIFFICULTY", difficulty })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Toggle
                label="효과음"
                on={state.settings.soundOn}
                onToggle={() => {
                  const next = !state.settings.soundOn;
                  dispatch({ type: "SET_SOUND", on: next });
                  if (next) playTap();
                }}
              />
              <Toggle
                label="움직임 줄이기"
                on={state.settings.reduceMotion}
                onToggle={() => dispatch({ type: "SET_REDUCE_MOTION", on: !state.settings.reduceMotion })}
              />
            </div>

            <div className="rounded-xl bg-[var(--color-card-soft)] px-3 py-2.5">
              <p className="text-xs font-bold text-[var(--color-ink-soft)]">
                기록을 지우면 여권 도장이 모두 사라져요
              </p>
              {confirmingReset ? (
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      dispatch({ type: "RESET_PROGRESS" });
                      setConfirmingReset(false);
                    }}
                  >
                    정말 지울래요
                  </Button>
                  <Button variant="soft" size="sm" className="flex-1" onClick={() => setConfirmingReset(false)}>
                    아니요
                  </Button>
                </div>
              ) : (
                <Button variant="soft" size="sm" className="mt-2" onClick={() => setConfirmingReset(true)}>
                  기록 지우기
                </Button>
              )}
            </div>
          </div>
        )}

        {panel === "how" && (
          <ol className="flex flex-col gap-1.5 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4 text-sm font-bold text-[var(--color-ink-soft)]">
            <li>1. 국기가 하나 나와요</li>
            <li>2. 어느 나라 국기인지 골라요</li>
            <li>3. 맞히면 여권에 도장이 쾅 찍혀요</li>
            <li>4. 나라 이름, 수도, 대륙을 같이 배워요</li>
            <li className="text-[var(--color-ink)]">틀린 나라는 모아 뒀다가 다시 물어봐요</li>
          </ol>
        )}

        <Button
          variant="soft"
          size="sm"
          className="w-full"
          onClick={() => {
            playTap();
            onOpenPassport();
          }}
        >
          내 여권 보기
          <span className="text-xs font-bold text-[var(--color-ink-soft)]">
            {stampCount}/{COUNTRIES.length}
          </span>
        </Button>

        {mistakeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              playTap();
              trackStart();
              onReviewMistakes();
            }}
            className="text-sm font-extrabold text-[var(--color-sky-deep)] underline underline-offset-2"
          >
            틀렸던 나라 {mistakeCount}개 다시 도전하기
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className="flex min-h-11 items-center justify-between rounded-xl border-2 border-[var(--color-border)] bg-white px-3"
    >
      <span className="text-sm font-black text-[var(--color-ink)]">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-[#6fcf97]" : "bg-[#e2d6c2]"}`}>
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
          style={{ left: on ? 22 : 2 }}
        />
      </span>
    </button>
  );
}
