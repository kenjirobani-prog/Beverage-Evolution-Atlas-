// LIVE client-side fetch from the World Bank API v2 (no key, CORS-enabled).
// Pulls the most-recent-non-empty value (mrnev=1) per country per indicator.

import { WB_INDICATORS } from "./constants";
import type { ISO3, WorldBankMetrics } from "./types";

const BASE = "https://api.worldbank.org/v2";

// World Bank rows look like: [ {page,...}, [ {country, value, date, ...}, ... ] ]
interface WbRow {
  countryiso3code: string;
  value: number | null;
  date: string;
}

type IndicatorKey = keyof typeof WB_INDICATORS;

async function fetchIndicator(
  isoList: ISO3[],
  code: string,
): Promise<Record<string, number>> {
  const countries = isoList.join(";");
  const url = `${BASE}/country/${countries}/indicator/${code}?format=json&mrnev=1&per_page=500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`World Bank ${code} -> HTTP ${res.status}`);
  const json = (await res.json()) as unknown;
  const out: Record<string, number> = {};
  if (Array.isArray(json) && Array.isArray(json[1])) {
    for (const row of json[1] as WbRow[]) {
      if (row && row.value != null && row.countryiso3code) {
        // Keep the first (latest) non-null we encounter per country.
        if (out[row.countryiso3code] == null) {
          out[row.countryiso3code] = row.value;
        }
      }
    }
  }
  return out;
}

// Fetch all four indicators in parallel and merge into per-country metrics.
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
    for (const [iso, value] of Object.entries(result.value)) {
      if (!merged[iso]) merged[iso] = {};
      merged[iso][key] = value;
    }
  });

  // Throw only if EVERY indicator failed (true network/API outage).
  const anyOk = settled.some((s) => s.status === "fulfilled");
  if (!anyOk) throw new Error("World Bank API unreachable for all indicators");

  return merged;
}
