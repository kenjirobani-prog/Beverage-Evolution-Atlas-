// SINGLE TYPED ACCESSOR for all beverage data.
// Everything (logic + UI) reads beverage numbers through getBeverage().
// Read order per (country, category): Euromonitor Passport (7 soft-drink
// categories) → WHO alcohol (beer, spirits_main) → proxy seed → undefined.

import { COUNTRY_SEED } from "@/data/beverages";
import { PASSPORT_VOLUMES_ML } from "@/data/passportVolumes";
import { getRealAlcohol, REAL_CATEGORY_META } from "@/data/realAlcohol";
import { getPopulation } from "./worldbank";
import type { BeverageDatum, Category, CountrySeed, ISO3 } from "./types";

const SEED_BY_ISO: Record<string, CountrySeed> = COUNTRY_SEED.reduce(
  (acc, c) => ({ ...acc, [c.iso3]: c }),
  {} as Record<string, CountrySeed>,
);

// Euromonitor Passport-covered categories (real per-capita data).
const PASSPORT_CATEGORIES: ReadonlySet<Category> = new Set<Category>([
  "water",
  "csd_sugar",
  "juice",
  "rtd_coffee",
  "rtd_tea_unsweet",
  "energy",
  "sports",
]);
const PASSPORT_UNIT = "L/人・年";
const PASSPORT_SOURCE = "Euromonitor Passport 2026 (2025)";
const PASSPORT_YEAR = 2025;

export function getCountrySeed(iso3: ISO3): CountrySeed | undefined {
  return SEED_BY_ISO[iso3];
}

export function listCountrySeeds(): CountrySeed[] {
  return COUNTRY_SEED;
}

// The one accessor.
export function getBeverage(
  country: ISO3,
  category: Category,
): BeverageDatum | undefined {
  const base = SEED_BY_ISO[country]?.beverages[category];
  const presence = base?.suntory_presence ?? "none";

  // 1) Euromonitor Passport real data (per-capita = million litres * 1e6 / pop).
  if (PASSPORT_CATEGORIES.has(category)) {
    const ml = PASSPORT_VOLUMES_ML[country]?.[category]?.[PASSPORT_YEAR];
    const pop = getPopulation(country);
    if (typeof ml === "number" && pop > 0) {
      return {
        value: Math.round(((ml * 1e6) / pop) * 10) / 10,
        unit: PASSPORT_UNIT,
        source: PASSPORT_SOURCE,
        isProxy: false,
        suntory_presence: presence,
      };
    }
  }

  // 2) WHO alcohol overlay (beer, spirits_main) — unchanged.
  const real = getRealAlcohol(country, category);
  const meta = REAL_CATEGORY_META[category];
  if (real != null && meta) {
    return {
      value: real,
      unit: meta.unit,
      source: meta.source,
      isProxy: false,
      suntory_presence: presence,
    };
  }

  // 3) proxy seed (original universe), else 4) undefined.
  return base;
}

// Category-level data provenance, for the chart axis label + source tag.
export function categoryMeta(category: Category): {
  isProxy: boolean;
  unit: string;
  source: string;
} {
  if (PASSPORT_CATEGORIES.has(category)) {
    return { isProxy: false, unit: PASSPORT_UNIT, source: PASSPORT_SOURCE };
  }
  const meta = REAL_CATEGORY_META[category];
  return meta
    ? { isProxy: false, unit: meta.unit, source: meta.source }
    : { isProxy: true, unit: "暫定指数", source: "暫定" };
}
