/**
 * 결정적(seedable) 의사난수 생성기.
 * 문제 생성 로직을 테스트 가능하게 만들기 위해 Math.random() 대신 사용한다.
 */
export type Rng = () => number;

/** mulberry32 알고리즘: 빠르고 충분히 균일한 32비트 시드 PRNG */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pickFrom<T>(rng: Rng, arr: readonly T[]): T {
  return arr[pickInt(rng, 0, arr.length - 1)];
}

/** Fisher-Yates 셔플 (원본을 변경하지 않고 새 배열 반환) */
export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = pickInt(rng, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 가중치가 있는 무작위 선택. weights는 items와 같은 길이여야 한다. */
export function weightedPick<T>(rng: Rng, items: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((sum, w) => sum + Math.max(w, 0), 0);
  if (total <= 0) return pickFrom(rng, items);
  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= Math.max(weights[i], 0);
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}
