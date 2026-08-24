import { useEffect } from "react";
import { useGame } from "../state/GameContext";
import * as audio from "../lib/audio";

/** 게임 설정(soundOn)과 Web Audio 모듈을 연결한다 */
export function useSound() {
  const { state } = useGame();
  const soundOn = state.settings.soundOn;

  useEffect(() => {
    audio.setSoundEnabled(soundOn);
  }, [soundOn]);

  return {
    tap: audio.playTap,
    correct: audio.playCorrect,
    hint: audio.playHint,
    fly: audio.playFly,
    stamp: audio.playStamp,
    fanfare: audio.playFanfare,
    unlock: audio.unlockAudio,
  };
}
