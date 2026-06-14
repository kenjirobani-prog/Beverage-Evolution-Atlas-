// LOGIC LAYER — pure functions over GDP, demographics and the proxy dataset.
// Reads beverage data ONLY via getBeverage(); reads Japan anchors via the
// JAPAN_TAKEOFF_GDP template. No UI concerns here.

import { JAPAN_TAKEOFF_GDP } from "@/data/japanTrajectory";
import { CATEGORIES, STAGES } from "./constants";
import { getBeverage } from "./beverage";
import type { Category, CountryView, Stage } from "./types";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// Standard logistic mapped to 0..100.
function logistic100(x: number, center: number, k: number): number {
  return 100 / (1 + Math.exp(-k * (x - center)));
}

// --- Ladder stage -----------------------------------------------------------

export function stageForGDP(gdp: number): Stage {
  for (const s of STAGES) {
    if (gdp >= s.min && gdp < s.max) return s.key;
  }
  return "S5";
}

// --- Japan lag --------------------------------------------------------------

export type JapanLagStatus = "pre-takeoff" | "takeoff-now" | "post-takeoff";

export interface JapanLag {
  status: JapanLagStatus;
  gapUSD: number; // gdp - anchor (negative => below the takeoff threshold)
  anchor: number;
}

export function japanLag(gdp: number, category: Category): JapanLag {
  const anchor = JAPAN_TAKEOFF_GDP[category];
  const gapUSD = Math.round(gdp - anchor);
  const within = Math.abs(gdp - anchor) <= anchor * 0.15; // ±15%
  let status: JapanLagStatus;
  if (within) status = "takeoff-now";
  else if (gdp < anchor) status = "pre-takeoff";
  else status = "post-takeoff";
  return { status, gapUSD, anchor };
}

// --- Next waves to arrive ----------------------------------------------------

// The 2–3 categories whose Japan-takeoff anchor sits just above current GDP.
export function nextToTakeoff(gdp: number): Category[] {
  return CATEGORIES.map((c) => c.key)
    .filter((cat) => JAPAN_TAKEOFF_GDP[cat] > gdp)
    .sort((a, b) => JAPAN_TAKEOFF_GDP[a] - JAPAN_TAKEOFF_GDP[b])
    .slice(0, 3);
}

// --- Dual engines -----------------------------------------------------------

// Sugar-shedding / wellness terrain. Logistic in GDP centered at 22k, plus a
// demographic bonus from the 65+ share of population.
export function healthPivotIndex(country: CountryView): number {
  const base = logistic100(country.gdp, 22000, 0.0002);
  const bonus = Math.min(20, (country.metrics.pop65Pct ?? 0) * 0.8);
  return Math.round(clamp(base + bonus, 0, 100));
}

// Premiumisation readiness. Logistic in GDP centered at 30k; hard-capped at 30
// where alcohol permissibility is restricted.
export function premiumizationClock(country: CountryView): number {
  const base = logistic100(country.gdp, 30000, 0.0002);
  const capped =
    country.alcohol_permissibility === "restricted" ? Math.min(base, 30) : base;
  return Math.round(clamp(capped, 0, 100));
}

export type Engine = "health" | "premium" | "both" | "emerging";

export function engineInSeason(country: CountryView): Engine {
  const h = healthPivotIndex(country);
  const p = premiumizationClock(country);
  if (h >= 60 && p >= 60) return "both";
  if (h >= 60 && p < 60) return "health";
  if (p >= 60 && h < 60) return "premium";
  return "emerging";
}

// --- White space ------------------------------------------------------------

// Categories where the market is at/past Japan's takeoff for that category AND
// Suntory's presence is still 'none' or 'low' — i.e. unclaimed terrain.
export function whiteSpace(country: CountryView): Category[] {
  return CATEGORIES.map((c) => c.key).filter((cat) => {
    const atOrPast = country.gdp >= JAPAN_TAKEOFF_GDP[cat];
    const datum = getBeverage(country.iso3, cat);
    const weak =
      datum?.suntory_presence === "none" || datum?.suntory_presence === "low";
    return atOrPast && weak;
  });
}

// --- Portfolio recommendation ------------------------------------------------

export function portfolioRecommendation(engine: Engine): {
  headline: string;
  brands: string;
} {
  switch (engine) {
    case "health":
      return {
        headline: "Lead with the wellness engine — sugar is receding.",
        brands: "天然水 ・ 伊右衛門特茶 ・ GREEN DA・KA・RA",
      };
    case "premium":
      return {
        headline: "Lead with the premium engine — trade-up is live.",
        brands: "山崎 ・ 白州 ・ 響",
      };
    case "both":
      return {
        headline: "Barbell play — run health and premium engines together.",
        brands: "天然水・特茶・GREEN DA・KA・RA  ＋  山崎・白州・響",
      };
    default:
      return {
        headline: "Emerging market — seed mainstream access, build the brand.",
        brands: "サントリー天然水 ・ BOSS ・ mainstream CSD entry",
      };
  }
}
