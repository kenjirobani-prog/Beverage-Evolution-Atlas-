"use client";

import {
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { JAPAN_TAKEOFF_GDP } from "@/data/japanTrajectory";
import { categoryMeta, getBeverage } from "@/lib/beverage";
import { CATEGORY_LABEL, PALETTE } from "@/lib/constants";
import { projectedGdp } from "@/lib/forecast";
import type { Category, CountryView, ISO3 } from "@/lib/types";

interface Point {
  iso: ISO3;
  name: string;
  nameJp: string;
  gdp: number; // projected GDP at the slider year (X position)
  baseGdp: number; // current/base GDP
  year: number;
  isProjected: boolean;
  vol: number;
  volUnit: string;
  volIsProxy: boolean;
  volSource: string;
  isJapan: boolean;
  fallback: boolean;
}

const X_TICKS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
const STAGE_BOUNDS = [3000, 8000, 20000, 40000];

function fmtUSD(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <div className="font-bold text-navy">
        {p.nameJp} ({p.iso})
      </div>
      <div className="text-slate-600">
        {p.isProjected
          ? `実質GDP（${p.year}年 投影）`
          : "実質GDP/capita（PPP＝購買力平価）"}
        :{" "}
        <strong>${Math.round(p.gdp).toLocaleString()}</strong>
        {p.fallback && <span className="text-gold">（シード値）</span>}
      </div>
      {p.isProjected && (
        <div className="text-[10px] text-slate-400">
          現在（{Math.round(p.baseGdp).toLocaleString()}）からの単純投影
        </div>
      )}
      <div className="text-slate-600">
        消費: <strong>{p.vol}</strong> {p.volUnit}
      </div>
      <div className="text-[10px] text-slate-400">
        {p.volIsProxy ? "暫定（代理値）" : `実データ：${p.volSource}`}
      </div>
    </div>
  );
}

export default function AtlasChart({
  views,
  category,
  year,
  selectedIso,
  onSelect,
}: {
  views: CountryView[];
  category: Category;
  year: number;
  selectedIso: ISO3 | null;
  onSelect: (iso: ISO3) => void;
}) {
  const data: Point[] = views
    .map((v) => {
      const bev = getBeverage(v.iso3, category);
      const isProjected = year > v.baseYear;
      return {
        iso: v.iso3,
        name: v.name,
        nameJp: v.nameJp,
        gdp: projectedGdp(v, year),
        baseGdp: v.gdp,
        year,
        isProjected,
        vol: bev?.value ?? 0,
        volUnit: bev?.unit ?? "暫定指数",
        volIsProxy: bev?.isProxy ?? true,
        volSource: bev?.source ?? "暫定",
        isJapan: v.iso3 === "JPN",
        fallback: v.gdpIsFallback,
      };
    })
    .filter((p) => p.gdp > 0)
    // On real-data categories, drop proxy points (e.g. TWN on beer/spirits)
    // so their index values don't distort the real-unit axis.
    .filter((p) => categoryMeta(category).isProxy || !p.volIsProxy);

  const anchor = JAPAN_TAKEOFF_GDP[category];
  const meta = categoryMeta(category);

  return (
    <div className="h-[460px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 24, bottom: 44, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="gdp"
            name="GDP/capita PPP"
            scale="log"
            domain={[1000, 150000]}
            ticks={X_TICKS}
            allowDataOverflow
            tick={{ fontSize: 11, fill: PALETTE.text }}
            tickFormatter={fmtUSD}
            label={{
              value: "実質GDP/capita（PPP＝購買力平価・定数国際$）— 対数軸",
              position: "insideBottom",
              offset: -28,
              style: { fontSize: 12, fill: PALETTE.navy },
            }}
          />
          <YAxis
            type="number"
            dataKey="vol"
            name="Proxy per-capita"
            tick={{ fontSize: 11, fill: PALETTE.text }}
            label={{
              value: `${CATEGORY_LABEL[category]}／一人当たり消費（${meta.unit}）`,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: PALETTE.navy, textAnchor: "middle" },
            }}
          />
          <ZAxis range={[90, 90]} />

          {STAGE_BOUNDS.map((x) => (
            <ReferenceLine
              key={x}
              x={x}
              stroke="#cbd5e1"
              strokeDasharray="2 4"
            />
          ))}
          <ReferenceLine
            x={anchor}
            stroke={PALETTE.gold}
            strokeWidth={1.5}
            label={{
              value: `日本浸透 ${fmtUSD(anchor)}`,
              position: "top",
              fill: PALETTE.gold,
              fontSize: 10,
            }}
          />

          <Tooltip
            content={<ChartTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />

          <Scatter
            data={data}
            onClick={(d: unknown) => {
              const iso = (d as { iso?: ISO3; payload?: { iso?: ISO3 } })?.iso
                ?? (d as { payload?: { iso?: ISO3 } })?.payload?.iso;
              if (iso) onSelect(iso);
            }}
            cursor="pointer"
            isAnimationActive
            animationDuration={600}
            animationEasing="ease"
          >
            {data.map((p) => {
              const selected = p.iso === selectedIso;
              const fill = p.isJapan ? PALETTE.gold : PALETTE.navy;
              return (
                <Cell
                  key={p.iso}
                  fill={fill}
                  stroke={selected ? PALETTE.teal : "#ffffff"}
                  strokeWidth={selected ? 3 : 1}
                />
              );
            })}
            <LabelList
              dataKey="iso"
              position="top"
              style={{ fontSize: 10, fill: PALETTE.text, fontWeight: 600 }}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
