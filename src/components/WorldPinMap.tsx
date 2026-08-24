import type { ContinentId } from "../types";
import { CONTINENT_PATHS, WORLD_MAP_TRANSFORM, WORLD_MAP_VIEWBOX } from "./worldMapPaths";

const ORDER: ContinentId[] = ["asia", "europe", "africa", "north-america", "south-america", "oceania"];

interface WorldPinMapProps {
  /** 이 나라의 대략적인 위경도 (수도 기준) */
  lat: number;
  lng: number;
  className?: string;
}

/** 위경도를 468×239 viewBox 좌표로 변환한다 (단순 등장방형 근사 — 핀 위치용으로 충분한 정밀도) */
function project(lat: number, lng: number): { x: number; y: number } {
  return { x: ((lng + 180) / 360) * 468, y: ((90 - lat) / 180) * 239 };
}

// Material Design "place" 아이콘의 핀 모양(24×24, 끝점이 (12,22))을 그대로 쓴다.
const PIN_PATH =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
const PIN_SCALE = 2.4; // 지도(468×239) 안에서 핀이 또렷하게 보이도록 크게 키운다

/**
 * 세계 지도 위에 이 나라 하나만 정확히 핀으로 찍어서 보여준다 (대륙 전체를 색칠하지 않는다).
 * 대륙 실루엣은 배경 맥락으로만 옅게 깔고, 실제 위치는 큼직한 핀이 나타낸다.
 * 출처: worldMapPaths.ts 참고 (Wikimedia Commons, Public Domain).
 */
export function WorldPinMap({ lat, lng, className }: WorldPinMapProps) {
  const { x, y } = project(lat, lng);

  return (
    <svg viewBox={WORLD_MAP_VIEWBOX} className={className} role="img" aria-label="세계 지도 위 이 나라의 대략적인 위치">
      <rect x="0" y="0" width="468" height="239" fill="var(--color-sky)" opacity="0.18" />
      <g transform={WORLD_MAP_TRANSFORM}>
        {ORDER.map((id) => (
          <g key={id}>
            {CONTINENT_PATHS[id].map((d, i) => (
              <path key={i} d={d} fill="var(--color-border)" />
            ))}
          </g>
        ))}
      </g>

      {/* 핀: tip(12,22)이 정확히 (x,y)에 오도록 옮긴 뒤 크게 확대한다 */}
      <g transform={`translate(${x} ${y}) scale(${PIN_SCALE}) translate(-12,-22)`}>
        <circle cx="12" cy="9" r="9" fill="var(--color-globe)" opacity="0.3">
          <animate attributeName="r" values="8;15;8" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <path d={PIN_PATH} fill="var(--color-globe)" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="3.4" fill="white" />
      </g>
    </svg>
  );
}
