/**
 * 한글 조사(을/를, 이/가, 이에요/예요) 자동 선택.
 * 나라 이름 받침 유무가 제각각이라 문구를 자연스럽게 만들려면 계산이 필요하다.
 */
function hasBatchim(text: string): boolean {
  const lastChar = text.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false; // 한글 음절이 아니면 받침 없다고 간주
  return (code - 0xac00) % 28 !== 0;
}

export function withEulReul(word: string): string {
  return word + (hasBatchim(word) ? "을" : "를");
}

export function withIGa(word: string): string {
  return word + (hasBatchim(word) ? "이" : "가");
}

export function withEunNeun(word: string): string {
  return word + (hasBatchim(word) ? "은" : "는");
}
