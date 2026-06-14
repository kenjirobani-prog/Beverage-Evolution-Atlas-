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
  | "sports_energy"
  | "functional"
  | "protein"
  | "beer"
  | "spirits_main"
  | "spirits_premium";

export type ISO3 =
  | "JPN" | "USA" | "DEU" | "GBR" | "FRA" | "KOR" | "CHN" | "VNM"
  | "IND" | "IDN" | "PHL" | "THA" | "MYS" | "MEX" | "BRA" | "NGA"
  | "SGP" | "TWN" | "AUS" | "TUR" | "ZAF" | "EGY";

export type SuntoryPresence = "none" | "low" | "mid" | "high";

export type AlcoholPermissibility = "normal" | "restricted";

export type Stage = "S1" | "S2" | "S3" | "S4" | "S5";

// One beverage cell: an illustrative per-capita proxy volume plus a coarse
// read on how present Suntory's portfolio is in that country/category today.
export interface BeverageDatum {
  // ILLUSTRATIVE proxy per-capita annual volume (rough, unit-agnostic index).
  proxyPerCapita: number;
  suntory_presence: SuntoryPresence;
}

// Per-country seed record. `gdpFallback` is only used when the World Bank API
// is missing a GDP/capita value for the country (e.g. TWN, not a WB member).
export interface CountrySeed {
  iso3: ISO3;
  name: string;
  nameJp: string;
  alcohol_permissibility: AlcoholPermissibility;
  gdpFallback?: number;
  beverages: Record<Category, BeverageDatum>;
}

// Live indicators pulled from the World Bank API (client-side).
export interface WorldBankMetrics {
  gdpPcapPpp?: number; // NY.GDP.PCAP.PP.KD (constant 2021 int'l $, real PPP)
  urbanPct?: number; // SP.URB.TOTL.IN.ZS
  femaleLaborPct?: number; // SL.TLF.CACT.FE.ZS
  pop65Pct?: number; // SP.POP.65UP.TO.ZS
}

// The merged view the UI actually consumes per country.
export interface CountryView extends CountrySeed {
  metrics: WorldBankMetrics;
  // Effective GDP/capita PPP used by all logic (live, or seed fallback).
  gdp: number;
  gdpIsFallback: boolean;
}
