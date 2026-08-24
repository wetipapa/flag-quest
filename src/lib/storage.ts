/**
 * localStorage 안전 래퍼.
 * 시크릿 모드, 저장공간 초과, JSON 파싱 실패 등 어떤 이유로도 게임이 멈추면 안 되므로
 * 모든 접근을 try/catch로 감싸고 실패 시 조용히 무시(또는 기본값 반환)한다.
 */

const STORAGE_KEY = "flag-quest:v1";

export function loadState<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallback;
    return { ...fallback, ...parsed } as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(state: T): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 저장 실패해도 게임 플레이는 계속되어야 한다 (조용히 무시)
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
