"use client";

import { JAPAN_TAKEOFF } from "@/data/japanTrajectory";
import { CATEGORY_LABEL, STAGE_LABEL } from "@/lib/constants";
import {
  engineInSeason,
  healthPivotIndex,
  japanLag,
  nextToTakeoff,
  portfolioRecommendation,
  premiumizationClock,
  stageForGDP,
  whiteSpace,
  type Engine,
  type JapanLagStatus,
} from "@/lib/logic";
import { projectionTimeline, type CrossingStatus } from "@/lib/forecast";
import type { Category, CountryView } from "@/lib/types";

// いま効くエンジン（engineInSeason）の日本語表示。
const ENGINE_LABEL: Record<Engine, string> = {
  health: "健康",
  premium: "プレミアム",
  both: "両方",
  emerging: "黎明",
};

// 拡散ステータスの日本語表示。
const STATUS_LABEL: Record<JapanLagStatus, string> = {
  "pre-takeoff": "離陸前",
  "takeoff-now": "離陸期",
  "post-takeoff": "離陸後",
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

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-semibold text-navy">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-light-blue">
        <div
          className="h-2 rounded-full bg-navy"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
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
        チャート上の国（ドット）をクリックすると、発展ステージ・日本ラグ（拡散時計）・二大エンジン・ホワイトスペースを表示します。
      </div>
    );
  }

  const stage = stageForGDP(view.gdp);
  const stageInfo = STAGE_LABEL[stage];
  const lag = japanLag(view.gdp, category);
  const next = nextToTakeoff(view.gdp);
  const health = healthPivotIndex(view);
  const premium = premiumizationClock(view);
  const engine = engineInSeason(view);
  const rec = portfolioRecommendation(engine);
  const ws = whiteSpace(view);
  const anchor = JAPAN_TAKEOFF[category];
  const timeline = projectionTimeline(view);

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
          実質GDP/capita（PPP）${Math.round(view.gdp).toLocaleString()}
          {view.gdpIsFallback && <span className="text-gold">（シード値）</span>}
          {view.alcohol_permissibility === "restricted" && (
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              酒類：規制あり
            </span>
          )}
        </p>
      </div>

      <Section title="発展ステージ">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-navy px-2.5 py-1 text-sm font-bold text-white">
            {stage}
          </span>
          <span className="text-sm text-navy">{stageInfo.labelJp}</span>
        </div>
      </Section>

      <Section title={`日本=先行指標ラグ（拡散時計）・${CATEGORY_LABEL[category]}`}>
        <p className="text-sm">
          ステータス：{" "}
          <span className={`font-semibold ${lagColor}`}>
            {STATUS_LABEL[lag.status]}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          日本離陸（{anchor.takeoffYear}年・実質$
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
                追跡対象カテゴリーはすべて離陸済み
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

      <Section title="二大エンジン">
        <div className="space-y-2.5">
          <Bar label="ヘルスピボット指数" value={health} />
          <Bar label="プレミアム化時計" value={premium} />
        </div>
        <div className="mt-3 inline-block rounded-md bg-teal/20 px-2.5 py-1 text-xs font-semibold text-navy">
          いま効くエンジン：{ENGINE_LABEL[engine]}
        </div>
      </Section>

      <Section title="予測タイムライン">
        <p className="mb-2 text-[10px] text-slate-500">
          各カテゴリーが日本の離陸水準に到達する予測年（早い順）。金＝今後5年以内に到達見込み。
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

      <Section title="推奨ポートフォリオ">
        <p className="text-sm text-navy">{rec.headline}</p>
        <p className="mt-1 text-sm font-semibold text-dark-navy">{rec.brands}</p>
      </Section>

      <Section title="ホワイトスペース（空白市場）">
        {ws.length === 0 ? (
          <p className="text-xs text-slate-400">
            現在のプレゼンス水準では空白市場なし。
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {ws.map((c) => (
              <span
                key={c}
                className="rounded-full border border-teal bg-white px-2 py-0.5 text-xs font-medium text-navy"
              >
                {CATEGORY_LABEL[c]}
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-[10px] italic text-slate-400">
          プレゼンス・消費量は暫定（代理）データ。
        </p>
      </Section>

      <p className="border-t border-slate-100 pt-3 text-[10px] leading-snug text-slate-400">
        {CLOCK_NOTE}
      </p>
    </div>
  );
}
