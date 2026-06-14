"use client";

import { FORECAST_MAX_YEAR, FORECAST_MIN_YEAR } from "@/lib/forecast";

const ASSUMPTION_NOTE =
  "前提：IMF WEO実質成長率（一人当たり概算）を一定と仮定した単純投影。シナリオであり確定予測ではない。Passport導入で精緻化。";

export default function YearSlider({
  year,
  onChange,
}: {
  year: number;
  onChange: (y: number) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-light-blue/40 p-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor="forecast-year"
          className="whitespace-nowrap text-sm font-semibold text-navy"
        >
          予測年
        </label>
        <input
          id="forecast-year"
          type="range"
          min={FORECAST_MIN_YEAR}
          max={FORECAST_MAX_YEAR}
          step={1}
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-teal/40 accent-navy"
          aria-valuenow={year}
          aria-valuemin={FORECAST_MIN_YEAR}
          aria-valuemax={FORECAST_MAX_YEAR}
        />
        <span className="w-16 text-right text-lg font-bold tabular-nums text-dark-navy">
          {year}年
        </span>
      </div>
      <p className="mt-2 text-[10px] leading-snug text-slate-500">
        {ASSUMPTION_NOTE}
      </p>
    </div>
  );
}
