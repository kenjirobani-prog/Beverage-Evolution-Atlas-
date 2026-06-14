// JAPAN TEMPLATE — the year each beverage category "took off" in Japan, with the
// approximate REAL GDP/capita (PPP, CONSTANT international $) at that time.
//
// Basis note (important): Japan's takeoffs span 1965–2018. Pre-1990 GDP/capita
// only exists on a constant-PPP basis, so the whole "diffusion clock" is run on
// constant (real) PPP — World Bank NY.GDP.PCAP.PP.KD — NOT current-$ PPP.
//   - pre-1990 GDP figures: Maddison-basis approximation
//   - 1990+ GDP figures: World Bank constant-PPP basis
// Takeoff YEARS are sourced (see sourceNote); the GDP values are APPROXIMATE and
// meant as directional anchors, not precise econometric thresholds.

import type { Category } from "@/lib/types";

export interface JapanAnchor {
  takeoffYear: number;
  approxRealGdpPppConst: number; // constant int'l $ (real PPP)
  sourceNote: string;
}

export const JAPAN_TAKEOFF: Record<Category, JapanAnchor> = {
  csd_sugar: {
    takeoffYear: 1965,
    approxRealGdpPppConst: 11000,
    sourceNote: "コーラ等炭酸が1950s後半〜60sに普及",
  },
  beer: {
    takeoffYear: 1965,
    approxRealGdpPppConst: 11000,
    sourceNote: "ビールが清酒を抜き大衆酒化",
  },
  juice: {
    takeoffYear: 1970,
    approxRealGdpPppConst: 16000,
    sourceNote: "60–70sに普及",
  },
  rtd_coffee: {
    takeoffYear: 1975,
    approxRealGdpPppConst: 19000,
    sourceNote: "缶コーヒー(UCC1969/Georgia1975)＋自販機普及",
  },
  spirits_main: {
    takeoffYear: 1975,
    approxRealGdpPppConst: 19000,
    sourceNote: "ウイスキー水割り・焼酎の大衆化",
  },
  sports: {
    takeoffYear: 1983,
    approxRealGdpPppConst: 23000,
    sourceNote: "ポカリ1980/アクエリアス1983",
  },
  energy: {
    takeoffYear: 2006,
    approxRealGdpPppConst: 35000,
    sourceNote:
      "レッドブル日本上陸2005/06→モンスター2012で拡大（医薬部外品の栄養ドリンクとは別カテゴリー）",
  },
  rtd_alcohol: {
    takeoffYear: 1984,
    approxRealGdpPppConst: 24000,
    sourceNote:
      "タカラcanチューハイ1984（日本初の缶チューハイ）→80sチューハイブーム,2001氷結で女性層拡大",
  },
  rtd_tea_unsweet: {
    takeoffYear: 1990,
    approxRealGdpPppConst: 33000,
    sourceNote:
      "缶ウーロン1980→缶緑茶1985→PET1990→500mlPET1996（無糖市場）",
  },
  water: {
    takeoffYear: 1995,
    approxRealGdpPppConst: 34000,
    sourceNote:
      "業務用→家庭用(1983六甲/山崎,天然水1991),1994猛暑,1996小型PET解禁",
  },
  functional: {
    takeoffYear: 2003,
    approxRealGdpPppConst: 34000,
    sourceNote: "FOSHU制度1991→ヘルシア(カテキン)2003,特茶2013",
  },
  csd_zero: {
    takeoffYear: 2007,
    approxRealGdpPppConst: 35000,
    sourceNote: "コカ・コーラゼロ日本2007,ゼロ/低糖トレンド",
  },
  spirits_premium: {
    takeoffYear: 2010,
    approxRealGdpPppConst: 35000,
    sourceNote: "山崎シングルモルト1984→プレミアム/ハイボール隆盛2008〜",
  },
  protein: {
    takeoffYear: 2018,
    approxRealGdpPppConst: 39000,
    sourceNote:
      "明治ザバスMILK PROTEIN(2015刷新)→RTDプロテイン市場が2017〜急伸（最高所得帯のウェルネス）",
  },
};

// GDP-only view consumed by the logic + chart layers (the diffusion-clock anchor).
export const JAPAN_TAKEOFF_GDP: Record<Category, number> = Object.fromEntries(
  (Object.keys(JAPAN_TAKEOFF) as Category[]).map((c) => [
    c,
    JAPAN_TAKEOFF[c].approxRealGdpPppConst,
  ]),
) as Record<Category, number>;
