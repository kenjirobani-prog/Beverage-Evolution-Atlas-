// =============================================================================
// 暫定 / ILLUSTRATIVE — Suntory deployed-brand map (ISO3 → category → brands).
// Hand-curated, MVP scope. Markets/categories not listed = not deployed.
// To be validated/expanded with internal portfolio data + Euromonitor Passport.
// =============================================================================

import type { Category, ISO3 } from "@/lib/types";

export const SUNTORY_BRANDS: Partial<
  Record<ISO3, Partial<Record<Category, string[]>>>
> = {
  JPN: {
    spirits_premium: ["山崎", "白州", "響", "知多", "碧Ao", "ROKU"],
    spirits_main: ["角瓶", "オールド", "ローヤル", "トリス", "翠SUI", "HAKU", "梅酒"],
    rtd_alcohol: ["-196", "ほろよい", "翠ジンソーダ", "こだわり酒場のレモンサワー"],
    beer: ["ザ・プレミアム・モルツ", "金麦", "サントリー生"],
    water: ["サントリー天然水"],
    rtd_tea_unsweet: ["伊右衛門"],
    functional: ["特茶"],
    rtd_coffee: ["BOSS"],
    sports_energy: ["GREEN DA・KA・RA"],
    csd_sugar: ["C.C.レモン", "ペプシ"],
    juice: ["なっちゃん"],
  },
  USA: {
    spirits_main: [
      "Jim Beam", "Old Grand-Dad", "Old Crow", "Kessler", "Canadian Club",
      "Windsor", "Sauza", "Hornitos", "Pinnacle", "EFFEN", "VOX", "Cruzan",
      "DeKuyper", "MIDORI", "Sourz",
    ],
    spirits_premium: [
      "Maker's Mark", "Knob Creek", "Basil Hayden", "Booker's", "Baker's",
      "Old Overholt", "Tres Generaciones", "El Tesoro",
    ],
    rtd_alcohol: ["On The Rocks", "-196", "MARU-HI", "ジムビーム缶"],
    csd_sugar: ["ペプシ", "Mountain Dew", "Dr Pepper"],
  },
  GBR: {
    spirits_premium: [
      "Laphroaig", "Bowmore", "Auchentoshan", "Ardmore", "Glen Garioch",
      "Sipsmith", "Kilbeggan", "Connemara",
    ],
    spirits_main: ["Teacher's"],
    rtd_alcohol: ["-196", "Sipsmith缶"],
    sports_energy: ["Lucozade"],
    juice: ["Ribena"],
  },
  FRA: {
    csd_sugar: ["Orangina", "Oasis"],
    juice: ["Pulco", "Oasis"],
    rtd_tea_unsweet: ["MayTea"],
  },
  VNM: {
    rtd_alcohol: ["ほろよい", "-196"],
    rtd_tea_unsweet: ["TEA+", "MYTEA"],
    csd_sugar: ["ペプシ", "7UP"],
    water: ["AQUAFINA"],
    sports_energy: ["Sting"],
  },
  THA: {
    functional: ["BRAND'S"],
    rtd_alcohol: ["ほろよい"],
    rtd_tea_unsweet: ["TEA+"],
    csd_sugar: ["ペプシ", "Mirinda", "7UP"],
    sports_energy: ["Gatorade"],
  },
  IDN: {
    rtd_tea_unsweet: ["MYTEA", "Mountea"],
    water: ["goodmood"],
    juice: ["Oky Jelly Drink"],
  },
  MYS: {
    functional: ["BRAND'S"],
    juice: ["Ribena"],
    sports_energy: ["Lucozade"],
  },
  SGP: {
    functional: ["BRAND'S"],
    juice: ["Ribena"],
    sports_energy: ["Lucozade"],
  },
  AUS: {
    rtd_alcohol: ["-196", "Koyomi Highball", "ジムビーム缶"],
    sports_energy: ["V Energy"],
    juice: ["Simply Squeezed", "Juice On"],
  },
};

// Accessor: deployed brand names for a country/category, or [] if none.
export function getDeployedBrands(iso3: ISO3, category: Category): string[] {
  return SUNTORY_BRANDS[iso3]?.[category] ?? [];
}
