// JAPAN TEMPLATE — approximate GDP/capita (PPP, USD) at which each beverage
// category "took off" in Japan. These are ILLUSTRATIVE, APPROXIMATE anchors
// used as the north-star reference for where other markets sit on the curve.
// TO BE REFINED with historical Euromonitor + macro series.

import type { Category } from "@/lib/types";

export const JAPAN_TAKEOFF_GDP: Record<Category, number> = {
  csd_sugar: 8000,
  juice: 10000,
  beer: 10000,
  spirits_main: 10000,
  rtd_coffee: 15000,
  sports_energy: 18000,
  water: 18000,
  rtd_tea_unsweet: 20000,
  csd_zero: 30000,
  spirits_premium: 35000,
  functional: 35000,
};
