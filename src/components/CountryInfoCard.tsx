import type { Country } from "../types";
import { CONTINENTS } from "../types";
import { FlagImage } from "./FlagImage";
import { WorldPinMap } from "./WorldPinMap";

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

      <WorldPinMap lat={country.lat} lng={country.lng} className="w-full h-24 rounded-2xl" />

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
