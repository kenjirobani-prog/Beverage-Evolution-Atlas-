// LOGIC LAYER — pure functions over GDP and the Japan-takeoff template.
// No UI concerns here.

import { JAPAN_TAKEOFF_GDP } from "@/data/japanTrajectory";
import { CATEGORIES, STAGES } from "./constants";
import type { Category, Stage } from "./types";

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
