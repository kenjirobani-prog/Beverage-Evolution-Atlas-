import type { Category, Stage } from "./types";

// The 12 beverage categories tracked by the Atlas, in evolution-ladder order.
// Display labels are Japanese; `key` stays the English code identifier.
export const CATEGORIES: { key: Category; label: string; labelJp: string }[] = [
  { key: "water", label: "水", labelJp: "水" },
  { key: "csd_sugar", label: "加糖炭酸", labelJp: "加糖炭酸" },
  { key: "csd_zero", label: "ゼロ・低糖炭酸", labelJp: "ゼロ・低糖炭酸" },
  { key: "rtd_tea_unsweet", label: "無糖RTD茶", labelJp: "無糖RTD茶" },
  { key: "rtd_coffee", label: "RTDコーヒー", labelJp: "RTDコーヒー" },
  { key: "juice", label: "果汁", labelJp: "果汁" },
  { key: "sports_energy", label: "スポーツ・エナジー", labelJp: "スポーツ・エナジー" },
  { key: "functional", label: "機能性（トクホ）", labelJp: "機能性（トクホ）" },
  { key: "protein", label: "プロテイン飲料", labelJp: "プロテイン飲料" },
  { key: "beer", label: "ビール", labelJp: "ビール" },
  { key: "spirits_main", label: "主流スピリッツ", labelJp: "主流スピリッツ" },
  { key: "spirits_premium", label: "プレミアムスピリッツ", labelJp: "プレミアムスピリッツ" },
];

export const CATEGORY_LABEL: Record<Category, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: c.label }),
  {} as Record<Category, string>,
);

// Development ladder stages keyed by GDP/capita PPP (USD).
export const STAGES: {
  key: Stage;
  label: string;
  labelJp: string;
  min: number;
  max: number;
}[] = [
  { key: "S1", label: "基礎", labelJp: "基礎", min: 0, max: 3000 },
  { key: "S2", label: "離陸", labelJp: "離陸", min: 3000, max: 8000 },
  { key: "S3", label: "拡大", labelJp: "拡大", min: 8000, max: 20000 },
  { key: "S4", label: "成熟・健康転換", labelJp: "成熟・健康転換", min: 20000, max: 40000 },
  { key: "S5", label: "超細分化", labelJp: "超細分化", min: 40000, max: Infinity },
];

export const STAGE_LABEL: Record<Stage, { label: string; labelJp: string }> =
  STAGES.reduce(
    (acc, s) => ({ ...acc, [s.key]: { label: s.label, labelJp: s.labelJp } }),
    {} as Record<Stage, { label: string; labelJp: string }>,
  );

// World Bank indicator codes.
export const WB_INDICATORS = {
  // Constant 2021 international $ (REAL PPP). Required because Japan's takeoffs
  // span 1965–2018 and pre-1990 GDP only exists on a constant-PPP basis.
  gdpPcapPpp: "NY.GDP.PCAP.PP.KD",
  urbanPct: "SP.URB.TOTL.IN.ZS",
  femaleLaborPct: "SL.TLF.CACT.FE.ZS",
  pop65Pct: "SP.POP.65UP.TO.ZS",
} as const;

// Suntory brand palette.
export const PALETTE = {
  navy: "#1A3558",
  darkNavy: "#002060",
  teal: "#5BC2DC",
  lightBlue: "#E6F5F9",
  text: "#2D2D2D",
  gold: "#C9A227",
} as const;
