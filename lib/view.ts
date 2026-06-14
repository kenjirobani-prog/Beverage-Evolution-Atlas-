// Merge the live World Bank metrics with the seed records into the CountryView
// objects the UI renders. Picks an effective GDP: live value if present,
// otherwise the seed fallback (e.g. TWN, not a World Bank member).

import { listCountrySeeds } from "./beverage";
import type { CountryView, ISO3, WorldBankMetrics } from "./types";

export function buildCountryViews(
  metricsByIso: Record<string, WorldBankMetrics>,
): CountryView[] {
  return listCountrySeeds()
    .map((seed) => {
      const metrics = metricsByIso[seed.iso3] ?? {};
      const live = metrics.gdpPcapPpp;
      const gdpIsFallback = live == null;
      const gdp = live ?? seed.gdpFallback ?? 0;
      return { ...seed, metrics, gdp, gdpIsFallback };
    })
    .filter((v) => v.gdp > 0);
}

export function allIso3(): ISO3[] {
  return listCountrySeeds().map((s) => s.iso3);
}
