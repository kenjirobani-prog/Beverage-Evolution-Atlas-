// Core domain types for the Beverage Evolution Atlas (BEA).
// These types are deliberately the single contract between the seed PROXY
// dataset and the logic/UI layers. When the Euromonitor Passport dataset
// arrives, only data/beverages.ts needs to change — not logic or UI.

export type Category =
  | "water"
  | "csd_sugar"
  | "csd_zero"
  | "rtd_tea_unsweet"
  | "rtd_coffee"
  | "juice"
  | "sports"
  | "energy"
  | "functional"
  | "protein"
  | "rtd_alcohol"
  | "beer"
  | "spirits_main"
  | "spirits_premium";

export type ISO3 =
  // Original proxy-seed universe.
  | "JPN" | "USA" | "DEU" | "GBR" | "FRA" | "KOR" | "CHN" | "VNM"
  | "IND" | "IDN" | "PHL" | "THA" | "MYS" | "MEX" | "BRA" | "NGA"
  | "SGP" | "TWN" | "AUS" | "TUR" | "ZAF" | "EGY"
  // Added with the Euromonitor Passport dataset.
  | "AUT" | "BEL" | "CAN" | "HRV" | "DNK" | "FIN" | "GRC" | "HUN"
  | "IRL" | "ITA" | "NLD" | "NZL" | "NOR" | "POL" | "PRT" | "ROU"
  | "RUS" | "ESP" | "SWE" | "CHE" | "UKR";

export type SuntoryPresence = "none" | "low" | "mid" | "high";

export type AlcoholPermissibility = "normal" | "restricted";

export type Stage = "S1" | "S2" | "S3" | "S4" | "S5";

// One beverage cell. Carries the value plus its provenance so the UI can mark
// real public-source data vs. illustrative proxy, per (country, category).
export interface BeverageDatum {
  value: number; // per-capita figure (real unit when isProxy=false, else index)
  unit: string; // e.g. "L純アルコール/人・年" for real, "暫定指数" for proxy
  source: string; // e.g. "WHO (GHO)" for real, "暫定" for proxy
  isProxy: boolean;
  suntory_presence: SuntoryPresence;
}

// Country identity/metadata — the rendering universe. `gdpFallback` is only used
// when the World Bank API is missing a GDP/capita value (e.g. TWN, not a WB member).
export interface CountryMeta {
  iso3: ISO3;
  name: string;
  nameJp: string;
  alcohol_permissibility: AlcoholPermissibility;
  gdpFallback?: number;
}

// Per-country PROXY seed record (original universe; carries proxy beverages).
export interface CountrySeed extends CountryMeta {
  beverages: Record<Category, BeverageDatum>;
}

// Live indicators pulled from the World Bank API (client-side).
export interface WorldBankMetrics {
  gdpPcapPpp?: number; // NY.GDP.PCAP.PP.KD (constant 2021 int'l $, real PPP)
  gdpYear?: number; // the mrnev year of the GDP observation (forecast base year)
  urbanPct?: number; // SP.URB.TOTL.IN.ZS
  femaleLaborPct?: number; // SL.TLF.CACT.FE.ZS
  pop65Pct?: number; // SP.POP.65UP.TO.ZS
  popTotal?: number; // SP.POP.TOTL (persons) — for per-capita conversion
}

// The merged view the UI actually consumes per country. Beverage figures are
// read via getBeverage(), so the view itself carries only metadata + macro.
export interface CountryView extends CountryMeta {
  metrics: WorldBankMetrics;
  // Effective GDP/capita PPP used by all logic (live, or seed fallback).
  gdp: number;
  gdpIsFallback: boolean;
  // Base year of `gdp` — the World Bank mrnev year, or a fallback year for
  // countries served from seed (e.g. TWN). Used as the forecast origin.
  baseYear: number;
}
