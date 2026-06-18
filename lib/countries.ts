// Country rendering universe = original proxy-seed countries ∪ Passport-only
// countries. Beverage figures are read via getBeverage(); these entries carry
// metadata only. New countries have NO proxy beverages — getBeverage returns
// undefined for categories without Passport/WHO coverage (chart drops them).

import { COUNTRY_SEED } from "@/data/beverages";
import type { CountryMeta } from "./types";

// Passport-covered countries not present in the original proxy seed.
// All are normal-alcohol markets (no prohibition states added).
const EXTRA_COUNTRIES: CountryMeta[] = [
  { iso3: "AUT", name: "Austria", nameJp: "オーストリア", alcohol_permissibility: "normal" },
  { iso3: "BEL", name: "Belgium", nameJp: "ベルギー", alcohol_permissibility: "normal" },
  { iso3: "CAN", name: "Canada", nameJp: "カナダ", alcohol_permissibility: "normal" },
  { iso3: "HRV", name: "Croatia", nameJp: "クロアチア", alcohol_permissibility: "normal" },
  { iso3: "DNK", name: "Denmark", nameJp: "デンマーク", alcohol_permissibility: "normal" },
  { iso3: "FIN", name: "Finland", nameJp: "フィンランド", alcohol_permissibility: "normal" },
  { iso3: "GRC", name: "Greece", nameJp: "ギリシャ", alcohol_permissibility: "normal" },
  { iso3: "HUN", name: "Hungary", nameJp: "ハンガリー", alcohol_permissibility: "normal" },
  { iso3: "IRL", name: "Ireland", nameJp: "アイルランド", alcohol_permissibility: "normal" },
  { iso3: "ITA", name: "Italy", nameJp: "イタリア", alcohol_permissibility: "normal" },
  { iso3: "NLD", name: "Netherlands", nameJp: "オランダ", alcohol_permissibility: "normal" },
  { iso3: "NZL", name: "New Zealand", nameJp: "ニュージーランド", alcohol_permissibility: "normal" },
  { iso3: "NOR", name: "Norway", nameJp: "ノルウェー", alcohol_permissibility: "normal" },
  { iso3: "POL", name: "Poland", nameJp: "ポーランド", alcohol_permissibility: "normal" },
  { iso3: "PRT", name: "Portugal", nameJp: "ポルトガル", alcohol_permissibility: "normal" },
  { iso3: "ROU", name: "Romania", nameJp: "ルーマニア", alcohol_permissibility: "normal" },
  { iso3: "RUS", name: "Russia", nameJp: "ロシア", alcohol_permissibility: "normal" },
  { iso3: "ESP", name: "Spain", nameJp: "スペイン", alcohol_permissibility: "normal" },
  { iso3: "SWE", name: "Sweden", nameJp: "スウェーデン", alcohol_permissibility: "normal" },
  { iso3: "CHE", name: "Switzerland", nameJp: "スイス", alcohol_permissibility: "normal" },
  { iso3: "UKR", name: "Ukraine", nameJp: "ウクライナ", alcohol_permissibility: "normal" },
];

export const COUNTRY_META: CountryMeta[] = [
  ...COUNTRY_SEED.map(
    ({ iso3, name, nameJp, alcohol_permissibility, gdpFallback }): CountryMeta => ({
      iso3,
      name,
      nameJp,
      alcohol_permissibility,
      gdpFallback,
    }),
  ),
  ...EXTRA_COUNTRIES,
];
