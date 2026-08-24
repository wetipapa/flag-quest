import { lazy, Suspense } from "react";
import type { Country } from "../types";
import { CONTINENTS } from "../types";
import { FlagImage } from "./FlagImage";

// 대륙 지도 데이터(worldMapPaths.ts)가 100KB가 넘어, 첫 화면 로딩에 끼지 않도록
// 실제로 국가 정보 카드가 뜨는 시점에만 따로 내려받는다(코드 스플리팅).
const WorldPinMap = lazy(() => import("./WorldPinMap").then((m) => ({ default: m.WorldPinMap })));

export function CountryInfoCard({ country }: { country: Country }) {
  const continent = CONTINENTS.find((c) => c.id === country.continent);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <FlagImage code={country.code} label={`${country.nameKo} 국기`} className="w-16 h-11 rounded-lg border border-[var(--color-border)]" />
        <div>
          <p className="text-lg font-black text-[var(--color-ink)]">{country.nameKo}</p>
          <p className="text-xs font-bold text-[var(--color-ink-soft)]">
            {continent?.emoji} {continent?.labelKo}
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-24 rounded-2xl bg-[var(--color-border)] animate-pulse" aria-hidden="true" />}>
        <WorldPinMap lat={country.lat} lng={country.lng} className="w-full h-24 rounded-2xl" />
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
        <div className="col-span-2 rounded-xl bg-[var(--color-card-soft)] px-3 py-2">
          <dt className="font-bold text-[var(--color-ink-soft)] text-xs">쓰는 말</dt>
          <dd className="font-extrabold text-[var(--color-ink)]">{country.languageKo}</dd>
        </div>
      </dl>

      <p className="rounded-xl bg-[var(--color-globe-tint)] text-[var(--color-globe-ink)] px-3 py-2.5 text-sm font-bold leading-snug text-left">
        💡 {country.funFactKo}
      </p>
    </div>
  );
}
