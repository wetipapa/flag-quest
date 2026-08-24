import type { CourseId, Difficulty } from "../types";
import type { GameState } from "./gameState";
import { createDefaultState } from "./gameState";

export type GameAction =
  | { type: "ANSWER_RESULT"; code: string; correct: boolean; now: number }
  | { type: "SET_COURSE"; course: CourseId }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "SET_SOUND"; on: boolean }
  | { type: "SET_REDUCE_MOTION"; on: boolean }
  | { type: "RESET_PROGRESS" }
  | { type: "HYDRATE"; state: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ANSWER_RESULT": {
      const prev = state.visited[action.code];
      const nextRecord = {
        timesSeen: (prev?.timesSeen ?? 0) + 1,
        timesCorrect: (prev?.timesCorrect ?? 0) + (action.correct ? 1 : 0),
        timesWrong: (prev?.timesWrong ?? 0) + (action.correct ? 0 : 1),
        firstVisitedAt: prev?.firstVisitedAt ?? action.now,
        lastResult: (action.correct ? "correct" : "wrong") as "correct" | "wrong",
      };

      const mistakeQueue = action.correct
        ? state.mistakeQueue.filter((c) => c !== action.code)
        : state.mistakeQueue.includes(action.code)
          ? state.mistakeQueue
          : [...state.mistakeQueue, action.code];

      return {
        ...state,
        visited: { ...state.visited, [action.code]: nextRecord },
        mistakeQueue,
        totalAnswered: state.totalAnswered + 1,
        totalCorrect: state.totalCorrect + (action.correct ? 1 : 0),
      };
    }

    case "SET_COURSE":
      return { ...state, settings: { ...state.settings, course: action.course } };

    case "SET_DIFFICULTY":
      return { ...state, settings: { ...state.settings, difficulty: action.difficulty } };

    case "SET_SOUND":
      return { ...state, settings: { ...state.settings, soundOn: action.on } };

    case "SET_REDUCE_MOTION":
      return { ...state, settings: { ...state.settings, reduceMotion: action.on } };

    case "RESET_PROGRESS":
      return { ...createDefaultState(), settings: state.settings };

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}
