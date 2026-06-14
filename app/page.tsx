"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import AtlasChart from "@/components/AtlasChart";
import DetailPanel from "@/components/DetailPanel";
import YearSlider from "@/components/YearSlider";
import { fetchWorldBankMetrics } from "@/lib/worldbank";
import { FORECAST_MIN_YEAR } from "@/lib/forecast";
import { categoryMeta } from "@/lib/beverage";
import { allIso3, buildCountryViews } from "@/lib/view";
import type { Category, CountryView, ISO3, WorldBankMetrics } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("loading");
  const [metrics, setMetrics] = useState<Record<string, WorldBankMetrics>>({});
  const [category, setCategory] = useState<Category>("water");
  const [selectedIso, setSelectedIso] = useState<ISO3 | null>("JPN");
  const [year, setYear] = useState<number>(FORECAST_MIN_YEAR);

  useEffect(() => {
    let cancelled = false;
    fetchWorldBankMetrics(allIso3())
      .then((m) => {
        if (cancelled) return;
        setMetrics(m);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        // Degrade gracefully: render with seed fallbacks only.
        setMetrics({});
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const views: CountryView[] = useMemo(
    () => buildCountryViews(metrics),
    [metrics],
  );

  const selectedView = useMemo(
    () => views.find((v) => v.iso3 === selectedIso) ?? null,
    [views, selectedIso],
  );

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-6">
        {status === "loading" ? (
          <div className="flex h-[400px] items-center justify-center text-sm text-slate-500">
            World Bankの実データを取得中…
          </div>
        ) : (
          <>
            {status === "error" && (
              <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                World Bankのライブデータを取得できませんでした。シード値がある国のみ表示しています。マクロ指標が不完全な場合があります。
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Chart column */}
              <section className="min-w-0">
                <div className="mb-3 flex flex-col gap-3">
                  <h2 className="bea-heading text-base">
                    進化マップ：GDP × 嗜好
                  </h2>
                  <CategoryTabs selected={category} onSelect={setCategory} />
                  <YearSlider year={year} onChange={setYear} />
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <AtlasChart
                    views={views}
                    category={category}
                    year={year}
                    selectedIso={selectedIso}
                    onSelect={setSelectedIso}
                  />
                  <div className="px-2 pt-1">
                    {categoryMeta(category).isProxy ? (
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        暫定（Passportで精緻化）
                      </span>
                    ) : (
                      <span className="inline-block rounded bg-teal/20 px-2 py-0.5 text-[10px] font-medium text-navy">
                        実データ：{categoryMeta(category).source}
                      </span>
                    )}
                  </div>
                  {(category === "beer" || category === "spirits_main") && (
                    <p className="px-2 pt-1 text-[10px] text-slate-400">
                      WHOのspirits定義は狭義（焼酎・泡盛・清酒・RTDを含まない）。
                    </p>
                  )}
                  <p className="px-2 pt-1 text-[10px] italic text-slate-400">
                    縦軸＝選択カテゴリーの一人当たり消費（{categoryMeta(category).unit}）。金のドット＝日本（先行指標）。金の縦線＝選択カテゴリーにおける日本の浸透GDP。
                  </p>
                  <p className="px-2 pt-1 text-[10px] leading-snug text-slate-400">
                    拡散時計は方向性の市場状況の段階アナログ（実質PPP＝購買力平価ベース・概算）。正確な年数予測ではない。
                  </p>
                </div>
              </section>

              {/* Detail column */}
              <aside className="min-w-0">
                <DetailPanel view={selectedView} category={category} />
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-light-blue/40">
        <div className="mx-auto max-w-[1400px] px-6 py-3 text-[11px] text-slate-500">
          マクロ指標＝World Bankライブ取得（API v2・実質GDP/capita〔PPP＝購買力平価・定数国際$〕・取得可能な最新年）／酒類（ビール・主流スピリッツ）＝
          <strong>WHO (GHO) 実データ</strong>
          （2022年・15歳以上・純アルコール換算）／その他の飲料消費＝
          <strong>暫定（代理）データ</strong>
          。Passport導入時に差し替え。暫定値は外部引用不可。
        </div>
      </footer>
    </div>
  );
}
