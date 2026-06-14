// =============================================================================
// 暫定（代理）データ / ILLUSTRATIVE PROXY DATA — replace with Euromonitor Passport.
// =============================================================================
// Per country, per category (14 categories):
//   - proxyPerCapita (value): a rough, conservative per-capita annual volume
//     index (unit-agnostic; precision is NOT the goal for v0).
//   - suntory_presence: coarse read of Suntory's current footprint there.
// All of this is a PROXY/暫定 stand-in for the Euromonitor Passport dataset and
// MUST be surfaced as 暫定 in the UI. lib/beverage.ts overlays real public-source
// values where available (e.g. WHO alcohol for beer/spirits_main).
// Access ONLY via lib/beverage.ts -> getBeverage() so Passport can replace this
// file later without touching logic or UI.
// =============================================================================

import type { CountrySeed, Category, BeverageDatum, SuntoryPresence } from "@/lib/types";

// Canonical category order used by the compact tuples below (14 categories;
// sports/energy are split; protein & rtd_alcohol sit between functional and beer).
const ORDER: Category[] = [
  "water",
  "csd_sugar",
  "csd_zero",
  "rtd_tea_unsweet",
  "rtd_coffee",
  "juice",
  "sports",
  "energy",
  "functional",
  "protein",
  "rtd_alcohol",
  "beer",
  "spirits_main",
  "spirits_premium",
];

type P = SuntoryPresence;

// Build a typed beverage record from two parallel tuples (volume, presence).
// Everything here is PROXY/暫定; lib/beverage.ts overlays real values where
// available (e.g. WHO alcohol for beer/spirits_main).
function build(
  vols: number[],
  pres: P[],
): Record<Category, BeverageDatum> {
  const out = {} as Record<Category, BeverageDatum>;
  ORDER.forEach((cat, i) => {
    out[cat] = {
      value: vols[i],
      unit: "暫定指数",
      source: "暫定",
      isProxy: true,
      suntory_presence: pres[i],
    };
  });
  return out;
}

export const COUNTRY_SEED: CountrySeed[] = [
  {
    iso3: "JPN", name: "Japan", nameJp: "日本", alcohol_permissibility: "normal",
    beverages: build(
      [22, 18, 14, 25, 18, 12, 16, 10, 14, 8, 18, 40, 6, 3],
      ["high","high","high","high","high","mid","high","low","high","low","high","high","high","high"],
    ),
  },
  {
    iso3: "USA", name: "United States", nameJp: "米国", alcohol_permissibility: "normal",
    beverages: build(
      [45, 38, 25, 4, 3, 22, 18, 14, 8, 14, 6, 75, 9, 4],
      ["low","low","low","low","low","mid","low","none","low","none","mid","low","high","high"],
    ),
  },
  {
    iso3: "DEU", name: "Germany", nameJp: "ドイツ", alcohol_permissibility: "normal",
    beverages: build(
      [40, 30, 18, 3, 2, 28, 12, 9, 6, 6, 4, 90, 6, 3],
      ["low","none","none","none","none","low","none","none","none","none","none","low","mid","mid"],
    ),
  },
  {
    iso3: "GBR", name: "United Kingdom", nameJp: "英国", alcohol_permissibility: "normal",
    beverages: build(
      [38, 32, 22, 3, 2, 24, 14, 10, 7, 7, 5, 70, 7, 3],
      ["low","low","low","none","none","low","low","low","none","none","low","low","mid","high"],
    ),
  },
  {
    iso3: "FRA", name: "France", nameJp: "フランス", alcohol_permissibility: "normal",
    beverages: build(
      [42, 28, 16, 3, 2, 26, 10, 4, 6, 4, 3, 33, 8, 4],
      ["low","mid","none","none","none","mid","none","none","none","none","none","low","mid","high"],
    ),
  },
  {
    iso3: "KOR", name: "South Korea", nameJp: "韓国", alcohol_permissibility: "normal",
    beverages: build(
      [25, 22, 14, 10, 12, 14, 14, 6, 10, 9, 4, 45, 9, 3],
      ["low","low","low","low","mid","low","low","none","low","none","none","low","mid","mid"],
    ),
  },
  {
    iso3: "CHN", name: "China", nameJp: "中国", alcohol_permissibility: "normal",
    beverages: build(
      [18, 16, 6, 8, 3, 8, 6, 4, 4, 2, 2, 30, 7, 1.5],
      ["mid","low","low","mid","low","low","low","none","low","none","none","low","low","mid"],
    ),
  },
  {
    iso3: "VNM", name: "Vietnam", nameJp: "ベトナム", alcohol_permissibility: "normal",
    beverages: build(
      [10, 14, 3, 5, 2, 6, 5, 9, 2, 1, 3, 45, 5, 0.5],
      ["low","low","none","low","none","low","none","low","none","none","low","low","low","low"],
    ),
  },
  {
    iso3: "IND", name: "India", nameJp: "インド", alcohol_permissibility: "restricted",
    beverages: build(
      [6, 8, 2, 3, 0.5, 5, 3, 2, 2, 0.5, 0.1, 2, 3, 0.3],
      ["none","none","none","none","none","low","none","none","none","none","none","none","low","low"],
    ),
  },
  {
    iso3: "IDN", name: "Indonesia", nameJp: "インドネシア", alcohol_permissibility: "restricted",
    beverages: build(
      [8, 12, 3, 6, 2, 6, 4, 3, 2, 0.5, 0.1, 1, 0.5, 0.1],
      ["low","low","none","low","none","low","none","none","none","none","none","none","none","none"],
    ),
  },
  {
    iso3: "PHL", name: "Philippines", nameJp: "フィリピン", alcohol_permissibility: "normal",
    beverages: build(
      [9, 18, 4, 3, 2, 7, 6, 4, 2, 1, 2, 18, 6, 0.4],
      ["low","low","none","none","none","low","none","none","none","none","none","low","low","low"],
    ),
  },
  {
    iso3: "THA", name: "Thailand", nameJp: "タイ", alcohol_permissibility: "normal",
    beverages: build(
      [14, 20, 6, 6, 3, 8, 8, 14, 3, 2, 3, 30, 7, 0.6],
      ["mid","mid","low","mid","low","low","low","none","none","none","low","low","low","low"],
    ),
  },
  {
    iso3: "MYS", name: "Malaysia", nameJp: "マレーシア", alcohol_permissibility: "normal",
    beverages: build(
      [16, 18, 6, 7, 4, 9, 8, 6, 4, 2, 1, 8, 3, 0.5],
      ["low","low","none","low","none","low","none","low","none","none","none","none","low","low"],
    ),
  },
  {
    iso3: "MEX", name: "Mexico", nameJp: "メキシコ", alcohol_permissibility: "normal",
    beverages: build(
      [30, 45, 14, 2, 1, 18, 10, 6, 4, 2, 4, 60, 6, 1],
      ["low","low","none","none","none","low","none","none","none","none","none","low","mid","mid"],
    ),
  },
  {
    iso3: "BRA", name: "Brazil", nameJp: "ブラジル", alcohol_permissibility: "normal",
    beverages: build(
      [24, 30, 10, 2, 1, 16, 9, 5, 4, 3, 3, 60, 5, 1],
      ["low","low","none","none","none","low","none","none","none","none","none","low","low","mid"],
    ),
  },
  {
    iso3: "NGA", name: "Nigeria", nameJp: "ナイジェリア", alcohol_permissibility: "normal",
    beverages: build(
      [5, 10, 2, 1, 0.3, 4, 3, 3, 1, 0.2, 1, 12, 4, 0.2],
      ["none","none","none","none","none","none","none","none","none","none","none","none","low","low"],
    ),
  },
  {
    iso3: "SGP", name: "Singapore", nameJp: "シンガポール", alcohol_permissibility: "normal",
    beverages: build(
      [30, 24, 16, 8, 6, 16, 14, 8, 10, 6, 4, 25, 6, 4],
      ["mid","mid","low","mid","mid","mid","mid","low","low","none","none","low","mid","high"],
    ),
  },
  {
    iso3: "TWN", name: "Taiwan", nameJp: "台湾", alcohol_permissibility: "normal",
    gdpFallback: 76000, // TWN is not a World Bank member; seed fallback GDP/cap PPP.
    beverages: build(
      [24, 20, 12, 14, 12, 12, 14, 8, 10, 5, 5, 30, 6, 2],
      ["mid","mid","low","mid","mid","low","mid","none","low","none","none","low","mid","mid"],
    ),
  },
  {
    iso3: "AUS", name: "Australia", nameJp: "オーストラリア", alcohol_permissibility: "normal",
    beverages: build(
      [40, 30, 22, 4, 4, 24, 16, 12, 8, 8, 8, 75, 7, 4],
      ["low","low","low","none","none","low","low","low","none","none","mid","low","mid","high"],
    ),
  },
  {
    iso3: "TUR", name: "Türkiye", nameJp: "トルコ", alcohol_permissibility: "normal",
    beverages: build(
      [14, 16, 6, 5, 1, 12, 7, 5, 3, 1.5, 1, 12, 3, 0.5],
      ["low","low","none","none","none","low","none","none","none","none","none","none","low","low"],
    ),
  },
  {
    iso3: "ZAF", name: "South Africa", nameJp: "南アフリカ", alcohol_permissibility: "normal",
    beverages: build(
      [14, 24, 8, 2, 1, 12, 8, 5, 3, 2, 3, 55, 5, 0.8],
      ["low","low","none","none","none","low","none","none","none","none","none","low","low","mid"],
    ),
  },
  {
    iso3: "EGY", name: "Egypt", nameJp: "エジプト", alcohol_permissibility: "restricted",
    beverages: build(
      [8, 14, 3, 3, 0.5, 6, 4, 3, 2, 0.3, 0.1, 1, 0.3, 0.1],
      ["none","none","none","none","none","low","none","none","none","none","none","none","none","none"],
    ),
  },
];
