"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type FieldConfig<T> = {
  key: keyof T;
  label: string;
  dir?: "ltr" | "rtl";
};

/**
 * Generic add/remove/reorder editor for small repeating lists of plain
 * string fields — nav links, footer guide links, branches. Each row's
 * fields are driven by `fields`, so the same component covers every shape.
 */
export function RepeatingListEditor<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  emptyItem,
  addLabel = "Add item",
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig<T>[];
  emptyItem: T;
  addLabel?: string;
  itemLabel?: (index: number) => string;
}) {
  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...items, { ...emptyItem }]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-brand-900/10 bg-white/60 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-brand-700/50">
              {itemLabel ? itemLabel(index) : `#${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-100/60 disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-100/60 disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fields.map((field) => (
              <input
                key={String(field.key)}
                dir={field.dir}
                value={item[field.key] ?? ""}
                onChange={(event) => update(index, { [field.key]: event.target.value } as Partial<T>)}
                placeholder={field.label}
                className="w-full rounded-lg border border-brand-900/15 bg-white/80 px-3 py-2 text-xs text-brand-forest outline-none focus:border-brand-gold"
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-gold"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}
