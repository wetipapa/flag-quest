import { useRef } from "react";
import type { TouchEvent } from "react";

interface UseSwipeNavOptions {
  /** 오른쪽으로 미는 제스처(이전 페이지로 돌아가기) */
  onBack?: () => void;
  /** 왼쪽으로 미는 제스처(다음 페이지로) */
  onForward?: () => void;
  /** 이 거리(px) 이상 가로로 움직여야 스와이프로 본다. 탭·세로 스크롤과 헷갈리지 않기 위함 */
  threshold?: number;
}

/**
 * 좌우 스와이프로 이전/다음 "페이지"를 넘기는 최소 터치 제스처 훅.
 * 세로 스크롤(버튼 목록을 훑어보는 것)과 구분하기 위해, 가로로 뚜렷하게 더 많이
 * 움직였을 때만 반응한다. 라이브러리 없이 touch 이벤트만으로 구현해 번들을 가볍게 유지한다.
 */
export function useSwipeNav({ onBack, onForward, threshold = 56 }: UseSwipeNavOptions) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: TouchEvent) {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx > 0) onBack?.();
    else onForward?.();
  }

  return { onTouchStart, onTouchEnd };
}
