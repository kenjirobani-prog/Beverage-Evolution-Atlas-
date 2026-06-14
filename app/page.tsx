"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import AtlasChart from "@/components/AtlasChart";
import DetailPanel from "@/components/DetailPanel";
import { fetchWorldBankMetrics } from "@/lib/worldbank";
import { allIso3, buildCountryViews } from "@/lib/view";
import type { Category, CountryView, ISO3, WorldBankMetrics } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("loading");
  const [metrics, setMetrics] = useState<Record<string, WorldBankMetrics>>({});
  const [category, setCategory] = useState<Category>("water");
  const [selectedIso, setSelectedIso] = useState<ISO3 | null>("JPN");

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
            Loading live World Bank indicators…
          </div>
        ) : (
          <>
            {status === "error" && (
              <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Live World Bank data is unavailable right now — showing seed
                fallbacks where present. Macro positions may be incomplete.
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              {/* Chart column */}
              <section className="min-w-0">
                <div className="mb-3 flex flex-col gap-3">
                  <h2 className="bea-heading text-base">
                    Evolution map · GDP × taste
                  </h2>
                  <CategoryTabs selected={category} onSelect={setCategory} />
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <AtlasChart
                    views={views}
                    category={category}
                    selectedIso={selectedIso}
                    onSelect={setSelectedIso}
                  />
                  <p className="px-2 pt-1 text-[10px] italic text-slate-400">
                    Y-axis = illustrative PROXY per-capita volume (pre-Passport).
                    Gold dot = Japan (north star). Gold line = Japan&apos;s takeoff
                    GDP for the selected category.
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
          Sources: macro = World Bank API v2 (live, latest available year);
          beverage volumes &amp; Suntory presence ={" "}
          <strong>illustrative proxy</strong>, to be replaced by Euromonitor
          Passport. All beverage figures are PROXY and not for external citation.
        </div>
      </footer>
    </div>
  );
}
