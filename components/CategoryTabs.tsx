"use client";

import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

export default function CategoryTabs({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((c) => {
        const active = c.key === selected;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelect(c.key)}
            aria-pressed={active}
            className={
              "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors " +
              (active
                ? "border-navy bg-navy text-white"
                : "border-slate-300 bg-white text-navy hover:border-teal hover:bg-light-blue")
            }
            title={c.labelJp}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
