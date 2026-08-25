import { lazy, Suspense, useState } from "react";
import type { Country } from "../types";
import { CONTINENTS } from "../types";
import { FlagImage } from "./FlagImage";
import { playTap } from "../lib/audio";

// 대륙 지도 데이터(worldMapPaths.ts)가 100KB가 넘어, 첫 화면 로딩에 끼지 않도록
// 실제로 국가 정보 카드가 뜨는 시점에만 따로 내려받는다(코드 스플리팅).
const WorldPinMap = lazy(() => import("./WorldPinMap").then((m) => ({ default: m.WorldPinMap })));

export function CountryInfoCard({ country }: { country: Country }) {
  const continent = CONTINENTS.find((c) => c.id === country.continent);
  // 작은 국기 썸네일을 누르면 이 상태를 켜서 아래 확대 모달을 띄운다
  const [flagZoomed, setFlagZoomed] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <button
          type="button"
          onClick={() => {
            playTap();
            setFlagZoomed(true);
          }}
          aria-label={`${country.nameKo} 국기 크게 보기`}
          className="active:scale-95 transition-transform"
        >
          <FlagImage code={country.code} label={`${country.nameKo} 국기`} className="w-16 h-11 rounded-lg border border-[var(--color-border)]" />
        </button>
        <div>
          <p className="text-lg font-black text-[var(--color-ink)]">{country.nameKo}</p>
          <p className="text-xs font-bold text-[var(--color-ink-soft)]">
            {continent?.emoji} {continent?.labelKo}
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-24 rounded-2xl bg-[var(--color-border)] animate-pulse mt-1" aria-hidden="true" />}>
        <WorldPinMap lat={country.lat} lng={country.lng} className="w-full h-24 rounded-2xl mt-1" />
      </Suspense>

      <dl className="grid grid-cols-2 gap-2 text-sm text-left">
        <div className="rounded-xl bg-[var(--color-card-soft)] px-3 py-2">
          <dt className="font-bold text-[var(--color-ink-soft)] text-xs">수도</dt>
          <dd className="font-extrabold text-[var(--color-ink)]">{country.capitalKo}</dd>
        </div>
        <div className="rounded-xl bg-[var(--color-card-soft)] px-3 py-2">
          <dt className="font-bold text-[var(--color-ink-soft)] text-xs">인구 ({country.populationYear}년 기준)</dt>
          <dd className="font-extrabold text-[var(--color-ink)]">{country.populationKo}</dd>
        </div>
        <div className={`${country.gdpRank ? "" : "col-span-2 "}rounded-xl bg-[var(--color-card-soft)] px-3 py-2`}>
          <dt className="font-bold text-[var(--color-ink-soft)] text-xs">쓰는 말</dt>
          <dd className="font-extrabold text-[var(--color-ink)]">{country.languageKo}</dd>
        </div>
        {/* 상위 40개국만 값이 있다. 없는 나라에는 이 칸이 뜨지 않는다 */}
        {country.gdpRank && (
          <div className="rounded-xl bg-[var(--color-card-soft)] px-3 py-2">
            <dt className="font-bold text-[var(--color-ink-soft)] text-xs">경제 규모</dt>
            <dd className="font-extrabold text-[var(--color-ink)]">세계 {country.gdpRank}위</dd>
          </div>
        )}
      </dl>

      <p className="rounded-xl bg-[var(--color-globe-tint)] text-[var(--color-globe-ink)] px-3 py-2.5 text-sm font-bold leading-snug text-left">
        💡 {country.funFactKo}
      </p>

      {/* 국기 색·문양의 뜻. 공식 유래가 뚜렷한 나라만 값이 있어 없으면 이 줄이 아예 안 뜬다 */}
      {country.flagMeaningKo && (
        <p className="rounded-xl bg-[var(--color-card-soft)] px-3 py-2.5 text-sm font-bold leading-snug text-left text-[var(--color-ink)]">
          🎨 {country.flagMeaningKo}
        </p>
      )}

      {/* 국기 확대 모달. `fixed`를 써서 이 카드가 스크롤되는 부모(정답 카드 등) 안에
          있어도 화면 전체를 덮는다 — `absolute`였으면 스크롤 영역 안에 갇혀 잘렸을 것이다 */}
      {flagZoomed && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-ink)]/60 backdrop-blur-sm p-6" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-xs animate-[pop-in_0.25s_ease-out]">
            <FlagImage
              code={country.code}
              label={`${country.nameKo} 국기`}
              className="w-full aspect-[4/3] rounded-2xl border-4 border-[var(--color-gold)] shadow-2xl shrink-0"
            />
            <button
              type="button"
              onClick={() => {
                playTap();
                setFlagZoomed(false);
              }}
              aria-label="닫기"
              className="absolute -top-4 -right-4 flex items-center justify-center h-10 w-10 rounded-full bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
