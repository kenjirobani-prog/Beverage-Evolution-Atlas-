// FORECAST LAYER — forward projection of each country along the real-PPP axis
// using a constant per-capita real growth assumption (IMF-WEO-derived).
// Simple compound-growth scenario; NOT a firm prediction.

import { GROWTH_PCT } from "@/data/growthProjections";
import { JAPAN_TAKEOFF_GDP } from "@/data/japanTrajectory";
import type { Category, CountryView } from "./types";

// Year-slider bounds.
export const FORECAST_MIN_YEAR = 2026;
export const FORECAST_MAX_YEAR = 2035;

// "Now" reference for the next-5-years highlight (app date: 2026).
const NOW_YEAR = 2026;
const SOON_HORIZON = NOW_YEAR + 5; // crossings at/under this year are "soon"

export function growthFor(view: CountryView): number {
  return GROWTH_PCT[view.iso3] ?? 0;
}

// Project a country's real-PPP GDP/capita to `year` via compound growth.
export function projectedGdp(view: CountryView, year: number): number {
  const g = growthFor(view);
  return view.gdp * Math.pow(1 + g / 100, year - view.baseYear);
}

export type CrossingStatus = "reached" | "soon" | "window" | "beyond" | "never";

export interface Crossing {
  category: Category;
  label: string;
  status: CrossingStatus;
  sortKey: number; // ascending = soonest first
}

// When does the projected GDP first reach the category's Japan takeoff anchor?
export function crossingYear(view: CountryView, category: Category): Crossing {
  const anchor = JAPAN_TAKEOFF_GDP[category];
  const baseGdp = view.gdp;
  const g = growthFor(view);

  if (baseGdp >= anchor) {
    return {
      category,
      label: "離陸後（到達済み）",
      status: "reached",
      sortKey: -1,
    };
  }
  if (g <= 0) {
    return { category, label: "予測範囲外", status: "never", sortKey: 99999 };
  }

  const yr =
    view.baseYear + Math.log(anchor / baseGdp) / Math.log(1 + g / 100);
  const yrCeil = Math.ceil(yr);

  if (yrCeil <= FORECAST_MAX_YEAR) {
    return {
      category,
      label: `${yrCeil}年頃`,
      status: yrCeil <= SOON_HORIZON ? "soon" : "window",
      sortKey: yrCeil,
    };
  }
  return { category, label: "2035年以降", status: "beyond", sortKey: 99998 };
}

// Full timeline for a country across all 12 categories, soonest-first.
export function projectionTimeline(view: CountryView): Crossing[] {
  return (Object.keys(JAPAN_TAKEOFF_GDP) as Category[])
    .map((c) => crossingYear(view, c))
    .sort((a, b) => a.sortKey - b.sortKey);
}
