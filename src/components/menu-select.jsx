"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

// Кастомный дропдаун в стиле селектора пресетов: белый триггер с шевроном,
// попап раскрывается ВВЕРХ (чтобы не проваливаться за низ экрана), опции с галочкой.
export function MenuSelect({ value, onChange, options, placeholder = "Выбрать", className }) {
  const [open, setOpen] = useState(false);
  const active = options.find((o) => String(o.value) === String(value));

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors hover:bg-muted/40 dark:bg-input/30"
      >
        <span className="truncate">{active ? active.label : placeholder}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 bottom-full z-30 mb-1 max-h-64 w-56 overflow-y-auto rounded-xl border bg-popover py-1 text-popover-foreground shadow-lg">
            {options.map((o) => {
              const on = String(o.value) === String(value);
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted",
                    on && "font-medium"
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    {on ? <Check className="size-4 text-primary" /> : null}
                  </span>
                  <span className="truncate">{o.label}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
