import { COUNTRIES, getCountriesByContinent, getCountry } from "../data/countries";
import { DIFFICULTIES } from "./difficulty";
import { pickInt, shuffle, weightedPick, type Rng } from "./rng";
import type { Country, CourseId, Difficulty, DifficultyConfig, QuestionSpec, VisitRecord } from "../types";

/** 난이도별 한 판의 문제 수 */
export const ROUND_LENGTH: Record<Difficulty, number> = { easy: 6, normal: 8, hard: 10 };

/** 여행 코스(대륙 필터)에 해당하는 국가 목록 */
export function getCoursePool(courseId: CourseId): Country[] {
  if (courseId === "world") return COUNTRIES;
  return getCountriesByContinent(courseId);
}

/**
 * 국가 하나를 이번 판에서 뽑을 상대적 가중치를 계산한다.
 * - 난이도의 등급(tier) 가중치를 기본으로 삼는다.
 * - 최근에 틀려 복습 대기 중인 나라는 더 자주 나오게 한다.
 * - 이미 여러 번 맞혀 익숙해진 나라는 조금 덜 나오게 해서 새 나라가 나올 자리를 만든다.
 */
export function computeWeight(
  country: Country,
  difficulty: DifficultyConfig,
  visited: Record<string, VisitRecord>,
  mistakeQueue: readonly string[],
): number {
  let weight = difficulty.tierWeights[country.tier];
  if (mistakeQueue.includes(country.code)) weight *= 3;
  const record = visited[country.code];
  if (record && record.timesCorrect >= 3) weight *= 0.35;
  return Math.max(weight, 0.05);
}

/** 중복 없이 count개의 국가를 가중치 기반으로 뽑는다 */
export function selectRoundTargets(
  pool: readonly Country[],
  count: number,
  difficulty: DifficultyConfig,
  visited: Record<string, VisitRecord>,
  mistakeQueue: readonly string[],
  rng: Rng,
): Country[] {
  const remaining = [...pool];
  const selected: Country[] = [];

  // 복습 대기 중인 나라를 최대 2개까지 우선 포함한다 (자연스러운 재등장)
  const reviewFirst = remaining.filter((c) => mistakeQueue.includes(c.code));
  for (const c of shuffle(rng, reviewFirst).slice(0, Math.min(2, count))) {
    selected.push(c);
    remaining.splice(remaining.indexOf(c), 1);
  }

  const target = Math.min(count, pool.length);
  while (selected.length < target && remaining.length > 0) {
    const weights = remaining.map((c) => computeWeight(c, difficulty, visited, mistakeQueue));
    const pick = weightedPick(rng, remaining, weights);
    selected.push(pick);
    remaining.splice(remaining.indexOf(pick), 1);
  }

  return shuffle(rng, selected);
}

/** 특정 국가 하나에 대한 문제(보기 포함)를 만든다 */
export function buildQuestion(
  target: Country,
  pool: readonly Country[],
  difficulty: DifficultyConfig,
  rng: Rng,
  isReview = false,
): QuestionSpec {
  const options: Country[] = [target];
  const usedCodes = new Set([target.code]);

  // 어려운 난이도일수록 국기가 비슷한 나라를 오답 보기로 섞는다
  if (target.confusables && target.confusables.length > 0 && rng() < difficulty.confusableChance) {
    const confusable = target.confusables
      .map((code) => COUNTRIES.find((c) => c.code === code))
      .filter((c): c is Country => !!c && !usedCodes.has(c.code));
    if (confusable.length > 0) {
      const pick = confusable[pickInt(rng, 0, confusable.length - 1)];
      options.push(pick);
      usedCodes.add(pick.code);
    }
  }

  // 나머지 오답은 같은 코스 풀에서 채우고, 풀이 너무 작으면 전체 국가에서 보충한다
  const candidatePools = [pool, COUNTRIES];
  for (const candidates of candidatePools) {
    if (options.length >= difficulty.optionCount) break;
    const shuffled = shuffle(rng, candidates.filter((c) => !usedCodes.has(c.code)));
    for (const c of shuffled) {
      if (options.length >= difficulty.optionCount) break;
      options.push(c);
      usedCodes.add(c.code);
    }
  }

  const shuffledOptions = shuffle(rng, options);
  const correctIndex = shuffledOptions.findIndex((c) => c.code === target.code);

  return {
    id: `${target.code}-${Math.floor(rng() * 1e9)}`,
    targetCode: target.code,
    optionCodes: shuffledOptions.map((c) => c.code),
    correctIndex,
    isReview,
  };
}

/** 한 판 전체의 문제 목록을 만든다 */
export function buildRound(
  courseId: CourseId,
  difficulty: Difficulty,
  visited: Record<string, VisitRecord>,
  mistakeQueue: readonly string[],
  rng: Rng,
): QuestionSpec[] {
  const pool = getCoursePool(courseId);
  const config = DIFFICULTIES[difficulty];
  const length = Math.min(ROUND_LENGTH[difficulty], pool.length);
  const targets = selectRoundTargets(pool, length, config, visited, mistakeQueue, rng);
  return targets.map((t) => buildQuestion(t, pool, config, rng, mistakeQueue.includes(t.code)));
}

/** 오답 후 같은 나라를 몇 문제 뒤 자연스럽게 다시 출제하기 위한 복습 문제를 만든다 */
export function buildReviewQuestion(targetCode: string, courseId: CourseId, difficulty: Difficulty, rng: Rng): QuestionSpec {
  const pool = getCoursePool(courseId);
  const config = DIFFICULTIES[difficulty];
  return buildQuestion(getCountry(targetCode), pool, config, rng, true);
}

/** "틀렸던 나라만 다시 도전" 전용 라운드: 대륙 구분 없이 오답 목록의 나라만 출제한다 */
export function buildMistakeRound(mistakeQueue: readonly string[], difficulty: Difficulty, rng: Rng): QuestionSpec[] {
  const config = DIFFICULTIES[difficulty];
  const codes = shuffle(rng, mistakeQueue).slice(0, Math.min(mistakeQueue.length, ROUND_LENGTH[difficulty]));
  return codes.map((code) => buildQuestion(getCountry(code), COUNTRIES, config, rng, true));
}
