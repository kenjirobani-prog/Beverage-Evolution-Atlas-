"use client";

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
} from "@/lib/logic";
import type { Category, CountryView } from "@/lib/types";

const ENGINE_LABEL: Record<Engine, string> = {
  health: "Health engine in season",
  premium: "Premium engine in season",
  both: "Both engines — barbell",
  emerging: "Emerging — pre-engine",
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
        Click a country dot on the chart to see its ladder stage, Japan-lag,
        dual-engine read, and white-space.
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
            {view.name}{" "}
            <span className="text-sm font-normal text-slate-500">
              {view.nameJp} · {view.iso3}
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          GDP/cap PPP ${Math.round(view.gdp).toLocaleString()}
          {view.gdpIsFallback && (
            <span className="text-gold"> (seed fallback)</span>
          )}
          {view.alcohol_permissibility === "restricted" && (
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              alcohol: restricted
            </span>
          )}
        </p>
      </div>

      <Section title="Ladder stage">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-navy px-2.5 py-1 text-sm font-bold text-white">
            {stage}
          </span>
          <span className="text-sm text-navy">
            {stageInfo.label}{" "}
            <span className="text-slate-500">／ {stageInfo.labelJp}</span>
          </span>
        </div>
      </Section>

      <Section title={`Japan-lag · ${CATEGORY_LABEL[category]}`}>
        <p className="text-sm">
          Status: <span className={`font-semibold ${lagColor}`}>{lag.status}</span>
        </p>
        <p className="text-xs text-slate-500">
          Gap vs JP takeoff (${lag.anchor.toLocaleString()}):{" "}
          <strong className={lag.gapUSD >= 0 ? "text-navy" : "text-slate-600"}>
            {lag.gapUSD >= 0 ? "+" : ""}
            {lag.gapUSD.toLocaleString()} USD
          </strong>
        </p>
        <div className="mt-2">
          <div className="text-xs text-slate-500">Next waves to arrive:</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {next.length === 0 ? (
              <span className="text-xs text-slate-400">
                all tracked categories already past takeoff
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

      <Section title="Dual-engine indicator">
        <div className="space-y-2.5">
          <Bar label="Health pivot index" value={health} />
          <Bar label="Premiumization clock" value={premium} />
        </div>
        <div className="mt-3 inline-block rounded-md bg-teal/20 px-2.5 py-1 text-xs font-semibold text-navy">
          {ENGINE_LABEL[engine]}
        </div>
      </Section>

      <Section title="Suntory portfolio play">
        <p className="text-sm text-navy">{rec.headline}</p>
        <p className="mt-1 text-sm font-semibold text-dark-navy">{rec.brands}</p>
      </Section>

      <Section title="White-space (proxy)">
        {ws.length === 0 ? (
          <p className="text-xs text-slate-400">
            No open white-space at current presence levels.
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
          Presence &amp; volumes are illustrative proxy data.
        </p>
      </Section>
    </div>
  );
}
