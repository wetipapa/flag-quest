import { describe, expect, it } from "vitest";
import { createRng, pickInt, shuffle, weightedPick } from "./rng";

describe("createRng", () => {
  it("같은 시드는 같은 수열을 만든다 (결정적)", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("0 이상 1 미만의 값을 반환한다", () => {
    const rng = createRng(1);
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pickInt", () => {
  it("min과 max 사이(포함)의 정수만 반환한다", () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i++) {
      const v = pickInt(rng, 3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("shuffle", () => {
  it("원본 배열을 변경하지 않는다", () => {
    const original = [1, 2, 3, 4, 5];
    const rng = createRng(3);
    shuffle(rng, original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("모든 원소를 그대로 유지한다 (순서만 바뀜)", () => {
    const original = [1, 2, 3, 4, 5];
    const rng = createRng(9);
    const result = shuffle(rng, original);
    expect(result.slice().sort()).toEqual(original.slice().sort());
  });
});

describe("weightedPick", () => {
  it("가중치가 0인 항목은 거의 뽑히지 않고, 가중치가 큰 항목이 더 자주 뽑힌다", () => {
    const rng = createRng(123);
    const items = ["a", "b"];
    const counts = { a: 0, b: 0 };
    for (let i = 0; i < 200; i++) {
      const pick = weightedPick(rng, items, [10, 0.001]);
      counts[pick as "a" | "b"]++;
    }
    expect(counts.a).toBeGreaterThan(counts.b);
  });
});
