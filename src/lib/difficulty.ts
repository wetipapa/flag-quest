import type { Difficulty, DifficultyConfig } from "../types";

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: "easy",
    labelKo: "쉬움",
    descriptionKo: "누구나 아는 나라 위주로 3개 중에 골라요",
    optionCount: 3,
    tierWeights: { 1: 6, 2: 1.5, 3: 0.3 },
    showContinentHint: true,
    confusableChance: 0,
  },
  normal: {
    id: "normal",
    labelKo: "보통",
    descriptionKo: "익숙한 나라와 조금 낯선 나라가 섞여요",
    optionCount: 4,
    tierWeights: { 1: 3, 2: 3, 3: 1 },
    showContinentHint: false,
    confusableChance: 0.25,
  },
  hard: {
    id: "hard",
    labelKo: "어려움",
    descriptionKo: "세계 곳곳의 낯선 나라까지 폭넓게 나와요",
    optionCount: 4,
    tierWeights: { 1: 1, 2: 2.5, 3: 4 },
    showContinentHint: false,
    confusableChance: 0.55,
  },
};

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "normal", "hard"];
