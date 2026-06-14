import type { Category, Stage } from "./types";

// The 11 beverage categories tracked by the Atlas, in evolution-ladder order.
export const CATEGORIES: { key: Category; label: string; labelJp: string }[] = [
  { key: "water", label: "Water", labelJp: "水" },
  { key: "csd_sugar", label: "CSD (Sugar)", labelJp: "炭酸（加糖）" },
  { key: "csd_zero", label: "CSD (Zero)", labelJp: "炭酸（ゼロ）" },
  { key: "rtd_tea_unsweet", label: "RTD Tea (Unsweet)", labelJp: "無糖茶" },
  { key: "rtd_coffee", label: "RTD Coffee", labelJp: "缶コーヒー" },
  { key: "juice", label: "Juice", labelJp: "ジュース" },
  { key: "sports_energy", label: "Sports / Energy", labelJp: "スポーツ・エナジー" },
  { key: "functional", label: "Functional", labelJp: "機能性" },
  { key: "beer", label: "Beer", labelJp: "ビール" },
  { key: "spirits_main", label: "Spirits (Mainstream)", labelJp: "蒸留酒（主流）" },
  { key: "spirits_premium", label: "Spirits (Premium)", labelJp: "蒸留酒（プレミアム）" },
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
  { key: "S1", label: "Subsistence", labelJp: "生活必需期", min: 0, max: 3000 },
  { key: "S2", label: "Emerging", labelJp: "新興期", min: 3000, max: 8000 },
  { key: "S3", label: "Take-off", labelJp: "離陸期", min: 8000, max: 20000 },
  { key: "S4", label: "Maturing", labelJp: "成熟期", min: 20000, max: 40000 },
  { key: "S5", label: "Premium / Health", labelJp: "プレミアム・健康期", min: 40000, max: Infinity },
];

export const STAGE_LABEL: Record<Stage, { label: string; labelJp: string }> =
  STAGES.reduce(
    (acc, s) => ({ ...acc, [s.key]: { label: s.label, labelJp: s.labelJp } }),
    {} as Record<Stage, { label: string; labelJp: string }>,
  );

// World Bank indicator codes.
export const WB_INDICATORS = {
  gdpPcapPpp: "NY.GDP.PCAP.PP.CD",
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
