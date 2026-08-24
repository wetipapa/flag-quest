import { describe, expect, it } from "vitest";
import { withEulReul, withIGa, withEunNeun } from "./korean";

describe("withEulReul", () => {
  it("받침이 있으면 '을'을 붙인다", () => {
    expect(withEulReul("대한민국")).toBe("대한민국을");
  });
  it("받침이 없으면 '를'을 붙인다", () => {
    expect(withEulReul("캐나다")).toBe("캐나다를");
  });
});

describe("withIGa", () => {
  it("받침이 있으면 '이'를 붙인다", () => {
    expect(withIGa("일본")).toBe("일본이");
  });
  it("받침이 없으면 '가'를 붙인다", () => {
    expect(withIGa("페루")).toBe("페루가");
  });
});

describe("withEunNeun", () => {
  it("받침이 있으면 '은'을 붙인다", () => {
    expect(withEunNeun("베트남")).toBe("베트남은");
  });
  it("받침이 없으면 '는'을 붙인다", () => {
    expect(withEunNeun("칠레")).toBe("칠레는");
  });
});
