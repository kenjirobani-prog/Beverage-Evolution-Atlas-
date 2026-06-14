"use client";

import { JAPAN_TAKEOFF } from "@/data/japanTrajectory";
import { getDeployedBrands } from "@/data/suntoryBrands";
import { CATEGORIES, CATEGORY_LABEL, STAGE_LABEL } from "@/lib/constants";
import {
  japanLag,
  nextToTakeoff,
  stageForGDP,
  type JapanLagStatus,
} from "@/lib/logic";
import { projectionTimeline, type CrossingStatus } from "@/lib/forecast";
import type { Category, CountryView } from "@/lib/types";

// 拡散ステータス（pre/now/post）の日本語表示。コード識別子は英語のまま。
const STATUS_LABEL: Record<JapanLagStatus, string> = {
  "pre-takeoff": "浸透前",
  "takeoff-now": "浸透期",
  "post-takeoff": "浸透済",
};

const CLOCK_NOTE =
  "拡散時計は方向性の発展段階アナログ（実質PPPベース・概算）。正確な年数予測ではない。";

// 予測タイムラインの行スタイル（次の5年以内＝soon を強調）。
const CROSSING_STYLE: Record<CrossingStatus, string> = {
  reached: "bg-slate-100 text-slate-400",
  soon: "bg-gold/90 text-[#2d2d2d] font-bold ring-1 ring-gold",
  window: "bg-light-blue text-navy",
  beyond: "bg-white text-slate-400 border border-slate-200",
  never: "bg-white text-slate-300 border border-dashed border-slate-200",
};

type PortfolioRow =
  | { category: Category; kind: "deployed"; brands: string[] }
  | { category: Category; kind: "whitespace" };

// Per-category portfolio view, driven by the deployed-brand map + clock status.
function buildPortfolio(view: CountryView): PortfolioRow[] {
  const rows: PortfolioRow[] = [];
  for (const { key } of CATEGORIES) {
    const brands = getDeployedBrands(view.iso3, key);
    if (brands.length > 0) {
      rows.push({ category: key, kind: "deployed", brands });
      continue;
    }
    // No deployed brand: flag as white space only once the market has reached
    // or passed Japan's takeoff for that category (浸透期 / 浸透済).
    const status = japanLag(view.gdp, key).status;
    if (status === "takeoff-now" || status === "post-takeoff") {
      rows.push({ category: key, kind: "whitespace" });
    }
    // 浸透前 → too early, show nothing.
  }
  return rows;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="bea-heading text-sm">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function DetailPanel({
  view,
  category,
}: {
  view: CountryView | null;
  category: Category;
}) {
  if (!view) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-light-blue/40 p-6 text-center text-sm text-slate-500">
        チャート上の国（ドット）をクリックすると、発展ステージ・日本=先行指標ラグ（拡散時計）・予測タイムライン・推奨ポートフォリオを表示します。
      </div>
    );
  }

  const stage = stageForGDP(view.gdp);
  const stageInfo = STAGE_LABEL[stage];
  const lag = japanLag(view.gdp, category);
  const next = nextToTakeoff(view.gdp);
  const anchor = JAPAN_TAKEOFF[category];
  const timeline = projectionTimeline(view);
  const portfolio = buildPortfolio(view);

  const lagColor =
    lag.status === "takeoff-now"
      ? "text-gold"
      : lag.status === "post-takeoff"
        ? "text-navy"
        : "text-slate-500";

  return (
    <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-navy">
            {view.nameJp}{" "}
            <span className="text-sm font-normal text-slate-500">
              {view.name} · {view.iso3}
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          実質GDP/capita（PPP＝購買力平価）${Math.round(view.gdp).toLocaleString()}
          {view.gdpIsFallback && <span className="text-gold">（シード値）</span>}
          {view.alcohol_permissibility === "restricted" && (
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              酒類：規制あり
            </span>
          )}
        </p>
      </div>

      <Section title="酒類/飲料の市場状況">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-navy px-2.5 py-1 text-sm font-bold text-white">
            {stage}
          </span>
          <span className="text-sm text-navy">{stageInfo.labelJp}</span>
        </div>
      </Section>

      <Section title={`日本＝先行指標・${CATEGORY_LABEL[category]}`}>
        <p className="text-sm">
          ステータス：{" "}
          <span className={`font-semibold ${lagColor}`}>
            {STATUS_LABEL[lag.status]}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          日本浸透（{anchor.takeoffYear}年・実質$
          {lag.anchor.toLocaleString()}）との差：{" "}
          <strong className={lag.gapUSD >= 0 ? "text-navy" : "text-slate-600"}>
            {lag.gapUSD >= 0 ? "+" : ""}
            {lag.gapUSD.toLocaleString()} 国際$
          </strong>
        </p>
        <p className="mt-1 text-[10px] leading-snug text-slate-400">
          {anchor.sourceNote}
        </p>
        <div className="mt-2">
          <div className="text-xs text-slate-500">次に立ち上がるカテゴリー：</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {next.length === 0 ? (
              <span className="text-xs text-slate-400">
                追跡対象カテゴリーはすべて浸透済
              </span>
            ) : (
              next.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-light-blue px-2 py-0.5 text-xs font-medium text-navy"
                >
                  {CATEGORY_LABEL[c]}
                </span>
              ))
            )}
          </div>
        </div>
      </Section>

      <Section title="予測タイムライン">
        <p className="mb-2 text-[10px] text-slate-500">
          各カテゴリーが日本の浸透水準に到達する予測年（早い順）。金＝今後5年以内に到達見込み。
        </p>
        <ul className="space-y-1">
          {timeline.map((t) => (
            <li
              key={t.category}
              className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs ${CROSSING_STYLE[t.status]}`}
            >
              <span>{CATEGORY_LABEL[t.category]}</span>
              <span className="tabular-nums">{t.label}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="推奨ポートフォリオ／展開状況">
        {portfolio.length === 0 ? (
          <p className="text-xs text-slate-400">
            現時点で浸透水準に達したカテゴリーはありません（早期市場）。
          </p>
        ) : (
          <ul className="space-y-1.5">
            {portfolio.map((row) => (
              <li
                key={row.category}
                className="rounded-md border border-slate-100 px-2.5 py-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-navy">
                    {CATEGORY_LABEL[row.category]}
                  </span>
                  {row.kind === "deployed" ? (
                    <span className="whitespace-nowrap rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">
                      展開済み
                    </span>
                  ) : (
                    <span className="whitespace-nowrap rounded-full border border-teal bg-white px-2 py-0.5 text-[10px] font-bold text-navy">
                      未展開
                    </span>
                  )}
                </div>
                {row.kind === "deployed" ? (
                  <p className="mt-1 text-xs text-dark-navy">
                    {row.brands.join(" ・ ")}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">
                    推奨：{CATEGORY_LABEL[row.category]}（カテゴリー参入）
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[10px] italic text-slate-400">
          ブランド展開マップ・消費量は暫定（代理）データ。
        </p>
      </Section>

      <p className="border-t border-slate-100 pt-3 text-[10px] leading-snug text-slate-400">
        {CLOCK_NOTE}
      </p>
    </div>
  );
}
