"use client";

import { categoryMeta } from "@/lib/beverage";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

// Real-data categories first (top-left), then proxy — ladder order within each.
const real = CATEGORIES.filter((c) => !categoryMeta(c.key).isProxy);
const proxy = CATEGORIES.filter((c) => categoryMeta(c.key).isProxy);
const ordered = [...real, ...proxy];

export default function CategoryTabs({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] text-slate-500">
        通常色＝実データ（WHO）／淡色＝暫定（代理・参考、クリックで表示可）
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ordered.map((c) => {
          const active = c.key === selected;
          const isProxy = categoryMeta(c.key).isProxy;
          const style = isProxy
            ? active
              ? "border-slate-400 bg-slate-400 text-white"
              : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100"
            : active
              ? "border-navy bg-navy text-white"
              : "border-slate-300 bg-white text-navy hover:border-teal hover:bg-light-blue";
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelect(c.key)}
              aria-pressed={active}
              className={
                "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors " +
                style
              }
              title={c.labelJp}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
