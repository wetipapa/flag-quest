import { describe, expect, it } from "vitest";
import { gameReducer } from "./gameReducer";
import { createDefaultState } from "./gameState";

describe("gameReducer", () => {
  it("정답이면 visited 기록이 쌓이고 mistakeQueue에서 빠진다", () => {
    const state = { ...createDefaultState(), mistakeQueue: ["kr"] };
    const next = gameReducer(state, { type: "ANSWER_RESULT", code: "kr", correct: true, now: 1000 });

    expect(next.visited.kr.timesCorrect).toBe(1);
    expect(next.visited.kr.timesSeen).toBe(1);
    expect(next.mistakeQueue).not.toContain("kr");
    expect(next.totalCorrect).toBe(1);
    expect(next.totalAnswered).toBe(1);
  });

  it("오답이면 mistakeQueue에 추가되고 중복 추가되지 않는다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "ANSWER_RESULT", code: "jp", correct: false, now: 1000 });
    state = gameReducer(state, { type: "ANSWER_RESULT", code: "jp", correct: false, now: 2000 });

    expect(state.mistakeQueue).toEqual(["jp"]);
    expect(state.visited.jp.timesWrong).toBe(2);
  });

  it("RESET_PROGRESS는 설정은 유지하고 진행 기록만 초기화한다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "SET_SOUND", on: false });
    state = gameReducer(state, { type: "ANSWER_RESULT", code: "kr", correct: true, now: 1000 });
    state = gameReducer(state, { type: "RESET_PROGRESS" });

    expect(state.visited).toEqual({});
    expect(state.settings.soundOn).toBe(false);
  });

  it("SET_COURSE / SET_DIFFICULTY는 설정을 갱신한다", () => {
    let state = createDefaultState();
    state = gameReducer(state, { type: "SET_COURSE", course: "asia" });
    state = gameReducer(state, { type: "SET_DIFFICULTY", difficulty: "hard" });

    expect(state.settings.course).toBe("asia");
    expect(state.settings.difficulty).toBe("hard");
  });
});
