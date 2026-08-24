import { useState } from "react";
import { useGame } from "../state/GameContext";
import { Button } from "../components/ui/Button";
import { playTap } from "../lib/audio";

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-ink)]/30 backdrop-blur-[2px] p-3">
      <div className="w-full max-w-sm rounded-[28px] bg-[var(--color-card)] border-4 border-[var(--color-border)] p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[var(--color-ink)] font-[var(--font-display)]">설정</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="설정 닫기"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-[var(--color-cream)] border-2 border-[var(--color-border)]"
          >
            ✕
          </button>
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-[var(--color-card-soft)] px-4 py-3">
          <span className="font-extrabold text-[var(--color-ink)]">소리</span>
          <input
            type="checkbox"
            checked={state.settings.soundOn}
            onChange={(e) => {
              dispatch({ type: "SET_SOUND", on: e.target.checked });
              if (e.target.checked) playTap();
            }}
            className="w-6 h-6 accent-[var(--color-globe)]"
            aria-label="효과음 켜기/끄기"
          />
        </label>

        <label className="flex items-center justify-between rounded-2xl bg-[var(--color-card-soft)] px-4 py-3">
          <span className="font-extrabold text-[var(--color-ink)]">움직임 줄이기</span>
          <input
            type="checkbox"
            checked={state.settings.reduceMotion}
            onChange={(e) => dispatch({ type: "SET_REDUCE_MOTION", on: e.target.checked })}
            className="w-6 h-6 accent-[var(--color-globe)]"
            aria-label="애니메이션 줄이기"
          />
        </label>

        <div className="rounded-2xl bg-[var(--color-card-soft)] px-4 py-3">
          <p className="font-extrabold text-[var(--color-ink)] mb-1">기록 초기화</p>
          <p className="text-xs font-bold text-[var(--color-ink-soft)] mb-3">여권 도장과 진행 기록이 모두 사라져요.</p>
          {confirmingReset ? (
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  dispatch({ type: "RESET_PROGRESS" });
                  setConfirmingReset(false);
                  onClose();
                }}
              >
                정말 초기화할래요
              </Button>
              <Button variant="soft" size="sm" className="flex-1" onClick={() => setConfirmingReset(false)}>
                아니요
              </Button>
            </div>
          ) : (
            <Button variant="soft" size="sm" onClick={() => setConfirmingReset(true)}>
              초기화하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
