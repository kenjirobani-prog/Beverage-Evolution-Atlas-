// =============================================================================
// REAL public-source data — WHO Global Health Observatory (GHO / GISAH).
// Indicator SA_0000001400: "Alcohol, recorded per capita (15+) consumption
// (in litres of pure alcohol), by beverage type." Latest available year: 2022.
// Pulled via the GHO OData API (https://ghoapi.azureedge.net/api/).
//   beer    -> ALCOHOLTYPE_SA_BEER     -> category "beer"
//   spirits -> ALCOHOLTYPE_SA_SPIRITS  -> category "spirits_main"
// Countries absent from WHO (e.g. TWN) keep their seed proxy value.
// =============================================================================

import type { Category, ISO3 } from "@/lib/types";

export const WHO_ALCOHOL_YEAR = 2022;
export const WHO_ALCOHOL_UNIT = "L純アルコール/人・年";
export const WHO_ALCOHOL_SOURCE = "WHO (GHO)";

// Recorded litres of pure alcohol per capita (15+), 2022.
const BEER: Partial<Record<ISO3, number>> = {
  JPN: 1.21, USA: 3.86, DEU: 4.85, GBR: 3.54, FRA: 2.67, KOR: 1.67,
  CHN: 1.21, VNM: 3.46, IND: 0.21, IDN: 0.05, PHL: 1.01, THA: 2.01,
  MYS: 0.51, MEX: 4.55, BRA: 5.05, NGA: 0.61, SGP: 1.27, AUS: 3.3,
  TUR: 0.76, ZAF: 3.65, EGY: 0.05,
};

const SPIRITS: Partial<Record<ISO3, number>> = {
  JPN: 1.2, USA: 4.01, DEU: 2.46, GBR: 2.6, FRA: 2.28, KOR: 0.31,
  CHN: 2.28, VNM: 0.19, IND: 2.87, IDN: 0.02, PHL: 3.81, THA: 4.5,
  MYS: 0.13, MEX: 0.57, BRA: 2.78, NGA: 0.54, SGP: 0.38, AUS: 1.72,
  TUR: 0.55, ZAF: 1.41, EGY: 0.04,
};

// Which categories carry real (non-proxy) data, with their shared unit/source.
export const REAL_CATEGORY_META: Partial<
  Record<Category, { unit: string; source: string }>
> = {
  beer: { unit: WHO_ALCOHOL_UNIT, source: WHO_ALCOHOL_SOURCE },
  spirits_main: { unit: WHO_ALCOHOL_UNIT, source: WHO_ALCOHOL_SOURCE },
};

// Real value for a (country, category), or null if not covered (-> keep proxy).
export function getRealAlcohol(
  iso3: ISO3,
  category: Category,
): number | null {
  if (category === "beer") return BEER[iso3] ?? null;
  if (category === "spirits_main") return SPIRITS[iso3] ?? null;
  return null;
}
