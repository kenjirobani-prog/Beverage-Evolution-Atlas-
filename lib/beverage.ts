// SINGLE TYPED ACCESSOR for all beverage data.
// Everything (logic + UI) reads beverage numbers through getBeverage().
// When the Euromonitor Passport dataset replaces data/beverages.ts, only the
// import below changes — logic and UI stay untouched. This is non-negotiable.

import { COUNTRY_SEED } from "@/data/beverages";
import { getRealAlcohol, REAL_CATEGORY_META } from "@/data/realAlcohol";
import type { BeverageDatum, Category, CountrySeed, ISO3 } from "./types";

const SEED_BY_ISO: Record<string, CountrySeed> = COUNTRY_SEED.reduce(
  (acc, c) => ({ ...acc, [c.iso3]: c }),
  {} as Record<string, CountrySeed>,
);

export function getCountrySeed(iso3: ISO3): CountrySeed | undefined {
  return SEED_BY_ISO[iso3];
}

export function listCountrySeeds(): CountrySeed[] {
  return COUNTRY_SEED;
}

// The one accessor. Returns the seed proxy datum, overlaid with real
// public-source data where available (currently WHO alcohol for beer /
// spirits_main). Undefined if the country/category is unknown.
export function getBeverage(
  country: ISO3,
  category: Category,
): BeverageDatum | undefined {
  const base = SEED_BY_ISO[country]?.beverages[category];
  if (!base) return undefined;

  const real = getRealAlcohol(country, category);
  const meta = REAL_CATEGORY_META[category];
  if (real != null && meta) {
    return {
      ...base,
      value: real,
      unit: meta.unit,
      source: meta.source,
      isProxy: false,
    };
  }
  return base; // proxy (incl. countries not covered by the real source)
}

// Category-level data provenance, for the chart axis label + source tag.
export function categoryMeta(category: Category): {
  isProxy: boolean;
  unit: string;
  source: string;
} {
  const meta = REAL_CATEGORY_META[category];
  return meta
    ? { isProxy: false, unit: meta.unit, source: meta.source }
    : { isProxy: true, unit: "暫定指数", source: "暫定" };
}
