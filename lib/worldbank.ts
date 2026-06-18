// LIVE client-side fetch from the World Bank API v2 (no key, CORS-enabled).
// Pulls the most-recent-non-empty value (mrnev=1) per country per indicator.

import { APPROX_POP_2024_M } from "@/data/passportVolumes";
import { WB_INDICATORS } from "./constants";
import type { ISO3, WorldBankMetrics } from "./types";

const BASE = "https://api.worldbank.org/v2";

// Module-level population cache, populated by fetchWorldBankMetrics, so the
// synchronous getBeverage() can convert Passport volumes to per-capita.
const POP_CACHE: Record<string, number> = {};

// Live population (persons), or APPROX_POP_2024_M fallback, or 0 if unknown.
export function getPopulation(iso3: ISO3): number {
  const live = POP_CACHE[iso3];
  if (live != null) return live;
  const approx = APPROX_POP_2024_M[iso3];
  return approx != null ? approx * 1e6 : 0;
}

// World Bank rows look like: [ {page,...}, [ {country, value, date, ...}, ... ] ]
interface WbRow {
  countryiso3code: string;
  value: number | null;
  date: string;
}

type IndicatorKey = keyof typeof WB_INDICATORS;

// Returns per-country { value, year } for the latest non-null observation.
async function fetchIndicator(
  isoList: ISO3[],
  code: string,
): Promise<Record<string, { value: number; year: number }>> {
  const countries = isoList.join(";");
  const url = `${BASE}/country/${countries}/indicator/${code}?format=json&mrnev=1&per_page=500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`World Bank ${code} -> HTTP ${res.status}`);
  const json = (await res.json()) as unknown;
  const out: Record<string, { value: number; year: number }> = {};
  if (Array.isArray(json) && Array.isArray(json[1])) {
    for (const row of json[1] as WbRow[]) {
      if (row && row.value != null && row.countryiso3code) {
        // Keep the first (latest) non-null we encounter per country.
        if (out[row.countryiso3code] == null) {
          out[row.countryiso3code] = {
            value: row.value,
            year: Number(row.date),
          };
        }
      }
    }
  }
  return out;
}

// Fetch all indicators in parallel and merge into per-country metrics.
// Indicators degrade independently: a failed/missing one is simply omitted.
export async function fetchWorldBankMetrics(
  isoList: ISO3[],
): Promise<Record<string, WorldBankMetrics>> {
  const keys = Object.keys(WB_INDICATORS) as IndicatorKey[];

  const settled = await Promise.allSettled(
    keys.map((k) => fetchIndicator(isoList, WB_INDICATORS[k])),
  );

  const merged: Record<string, WorldBankMetrics> = {};
  for (const iso of isoList) merged[iso] = {};

  settled.forEach((result, i) => {
    if (result.status !== "fulfilled") return; // indicator unavailable -> skip
    const key = keys[i];
    for (const [iso, obs] of Object.entries(result.value)) {
      if (!merged[iso]) merged[iso] = {};
      merged[iso][key] = obs.value;
      // Capture the base year of the GDP observation (used by the forecast).
      if (key === "gdpPcapPpp") merged[iso].gdpYear = obs.year;
      // Cache live population for synchronous per-capita conversion.
      if (key === "popTotal") POP_CACHE[iso] = obs.value;
    }
  });

  // Throw only if EVERY indicator failed (true network/API outage).
  const anyOk = settled.some((s) => s.status === "fulfilled");
  if (!anyOk) throw new Error("World Bank API unreachable for all indicators");

  return merged;
}
