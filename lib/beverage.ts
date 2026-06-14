// SINGLE TYPED ACCESSOR for all beverage data.
// Everything (logic + UI) reads beverage numbers through getBeverage().
// When the Euromonitor Passport dataset replaces data/beverages.ts, only the
// import below changes — logic and UI stay untouched. This is non-negotiable.

import { COUNTRY_SEED } from "@/data/beverages";
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

// The one accessor. Returns the proxy datum, or undefined if missing
// (callers degrade gracefully).
export function getBeverage(
  country: ISO3,
  category: Category,
): BeverageDatum | undefined {
  return SEED_BY_ISO[country]?.beverages[category];
}
