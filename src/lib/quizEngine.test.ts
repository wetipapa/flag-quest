import { describe, expect, it } from "vitest";
import { COUNTRIES } from "../data/countries";
import { DIFFICULTIES } from "./difficulty";
import { createRng } from "./rng";
import { buildQuestion, buildRound, getCoursePool, selectRoundTargets } from "./quizEngine";

describe("데이터 무결성", () => {
  it("모든 국가 코드는 소문자 2글자이고 중복이 없다", () => {
    const codes = COUNTRIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) {
      expect(code).toMatch(/^[a-z]{2}$/);
    }
  });

  it("confusables가 가리키는 코드는 실제 데이터에 존재한다", () => {
    const codes = new Set(COUNTRIES.map((c) => c.code));
    for (const c of COUNTRIES) {
      for (const confusable of c.confusables ?? []) {
        expect(codes.has(confusable)).toBe(true);
      }
    }
  });
});

describe("getCoursePool", () => {
  it("world는 전체 국가를 반환한다", () => {
    expect(getCoursePool("world")).toHaveLength(COUNTRIES.length);
  });

  it("대륙 코스는 해당 대륙 국가만 반환한다", () => {
    const pool = getCoursePool("south-america");
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((c) => c.continent === "south-america")).toBe(true);
  });
});

describe("buildQuestion", () => {
  it("정답 옵션이 정확히 하나 포함되고 옵션 수가 난이도와 일치한다", () => {
    const rng = createRng(11);
    const pool = getCoursePool("world");
    const target = COUNTRIES.find((c) => c.code === "kr")!;
    const config = DIFFICULTIES.normal;
    const q = buildQuestion(target, pool, config, rng);

    expect(q.optionCodes).toHaveLength(config.optionCount);
    expect(new Set(q.optionCodes).size).toBe(config.optionCount); // 중복 없음
    expect(q.optionCodes[q.correctIndex]).toBe(target.code);
  });
});

describe("selectRoundTargets", () => {
  it("중복 없는 국가를 요청한 개수만큼 뽑는다", () => {
    const rng = createRng(5);
    const pool = getCoursePool("world");
    const targets = selectRoundTargets(pool, 10, DIFFICULTIES.normal, {}, [], rng);
    expect(targets).toHaveLength(10);
    expect(new Set(targets.map((c) => c.code)).size).toBe(10);
  });

  it("복습 대기 중인 나라를 우선적으로 포함한다", () => {
    const rng = createRng(5);
    const pool = getCoursePool("world");
    const targets = selectRoundTargets(pool, 8, DIFFICULTIES.normal, {}, ["kr", "jp"], rng);
    const codes = targets.map((c) => c.code);
    expect(codes).toContain("kr");
    expect(codes).toContain("jp");
  });
});

describe("buildRound", () => {
  it("난이도별 라운드 길이만큼 문제를 만든다", () => {
    const rng = createRng(2);
    const round = buildRound("world", "easy", {}, [], rng);
    expect(round.length).toBeGreaterThan(0);
    for (const q of round) {
      expect(q.optionCodes[q.correctIndex]).toBe(q.targetCode);
    }
  });

  it("국가 수가 적은 대륙에서도 옵션 수만큼 보기를 만든다 (전체 국가에서 보충)", () => {
    const rng = createRng(2);
    const round = buildRound("south-america", "hard", {}, [], rng);
    for (const q of round) {
      expect(q.optionCodes).toHaveLength(DIFFICULTIES.hard.optionCount);
    }
  });
});
