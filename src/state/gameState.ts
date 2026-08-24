import type { CourseId, Difficulty, VisitRecord } from "../types";

export interface GameSettings {
  soundOn: boolean;
  reduceMotion: boolean;
  course: CourseId;
  difficulty: Difficulty;
}

export interface GameState {
  version: 1;
  /** 국가 코드별 방문 기록 (여권 도장) */
  visited: Record<string, VisitRecord>;
  /** 최근에 틀려서 우선적으로 다시 나와야 하는 나라들 */
  mistakeQueue: string[];
  totalAnswered: number;
  totalCorrect: number;
  settings: GameSettings;
}

export function createDefaultState(): GameState {
  return {
    version: 1,
    visited: {},
    mistakeQueue: [],
    totalAnswered: 0,
    totalCorrect: 0,
    settings: {
      soundOn: true,
      reduceMotion: false,
      course: "world",
      difficulty: "normal",
    },
  };
}
