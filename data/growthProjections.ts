// 一人当たり実質GDP成長率の前提（年率 %）。
// IMF WEO 2025年10月の実質GDP成長率から概算人口増を控除した一人当たり実質成長率の概算。
// シナリオ前提であり確定予測ではない。
// (Per-capita real GDP growth assumption, % per year. Approximation derived from
//  IMF WEO Oct-2025 real GDP growth net of rough population growth. Scenario
//  assumption, NOT a firm forecast.)

import type { ISO3 } from "@/lib/types";

export const GROWTH_PCT: Record<ISO3, number> = {
  JPN: 1.0,
  USA: 1.5,
  DEU: 0.8,
  GBR: 1.0,
  FRA: 0.9,
  KOR: 2.0,
  CHN: 3.8,
  VNM: 5.3,
  IND: 5.5,
  IDN: 4.3,
  PHL: 4.6,
  THA: 2.7,
  MYS: 3.4,
  MEX: 1.0,
  BRA: 1.8,
  NGA: 1.0,
  SGP: 1.5,
  TWN: 2.5,
  AUS: 1.3,
  TUR: 2.4,
  ZAF: 0.7,
  EGY: 2.9,
};
