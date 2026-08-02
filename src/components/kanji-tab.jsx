"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { KanjiCard } from "@/components/kanji-breakdown";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Shuffle, List } from "lucide-react";
import { toast } from "sonner";

// Подсветка плитки по типу знака: 形声 (есть фонетик) — голубым, остальные — нейтрально.
function tileTone(k, selected) {
  if (k.char === selected) return "border-primary bg-primary/10";
  if (k.etym?.code === "ps") return "border-sky-500/30 hover:bg-sky-500/5";
  return "border-border hover:bg-muted";
}

export function KanjiTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .kanjiList()
      .then((r) => {
        if (!alive) return;
        const its = r.items || [];
        setItems(its);
        setSelected(its.length ? its[Math.floor(Math.random() * its.length)].char : null);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const current = items.find((k) => k.char === selected) || null;

  function pickRandom() {
    if (items.length) setSelected(items[Math.floor(Math.random() * items.length)].char);
  }

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-muted-foreground">
        В словаре пока нет слов с кандзи.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button className="fun-btn fun-neutral h-10 min-h-0 px-3 text-sm" onClick={pickRandom}>
            <Shuffle className="size-4" /> Другое
          </button>
          <button
            className={cn("fun-btn h-10 min-h-0 px-3 text-sm", showList ? "fun-primary" : "fun-neutral")}
            onClick={() => setShowList((s) => !s)}
          >
            <List className="size-4" /> Список
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{items.length} знаков</span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-emerald-500/70" /> смысл
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-sky-500/70" /> звук
          </span>
        </div>
      </div>

      {current ? (
        <Card>
          <CardContent className="p-5">
            <KanjiCard k={current} />
          </CardContent>
        </Card>
      ) : null}

      {showList ? (
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {items.map((k) => (
            <button
              key={k.char}
              onClick={() => {
                setSelected(k.char);
                setShowList(false);
              }}
              title={k.meaning || k.char}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border font-jp text-2xl transition-colors",
                tileTone(k, selected)
              )}
            >
              {k.char}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
