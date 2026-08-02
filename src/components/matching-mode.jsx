"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Check, X, ArrowRight, RefreshCw } from "lucide-react";

function shuffleIdx(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchingMode({ presetId, onAdvance }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [leftOrder, setLeftOrder] = useState([]);
  const [rightOrder, setRightOrder] = useState([]);
  const [pairs, setPairs] = useState({}); // leftIdx -> rightIdx
  const [selLeft, setSelLeft] = useState(null);
  const [checked, setChecked] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setChecked(false);
    setPairs({});
    setSelLeft(null);
    try {
      const { items } = await api.matching(presetId);
      if (!items || items.length < 2) {
        setItems(null);
        setErr("Мало предложений для сопоставления — добавь или сгенерируй их во вкладке «Предложения».");
      } else {
        setItems(items);
        setLeftOrder(shuffleIdx(items.length));
        setRightOrder(shuffleIdx(items.length));
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [presetId]);

  useEffect(() => {
    load();
  }, [load]);

  // Номера пар (общие для левой и правой половины) — по возрастанию leftIdx.
  const pairNum = {};
  Object.keys(pairs)
    .sort((a, b) => a - b)
    .forEach((l, i) => (pairNum[l] = i + 1));
  const ownerOf = (ridx) => Object.keys(pairs).find((l) => pairs[l] === ridx);

  function clickLeft(idx) {
    if (checked) return;
    if (pairs[idx] != null) {
      setPairs((p) => {
        const n = { ...p };
        delete n[idx];
        return n;
      });
      setSelLeft(null);
      return;
    }
    setSelLeft((s) => (s === idx ? null : idx));
  }

  function clickRight(ridx) {
    if (checked) return;
    const owner = ownerOf(ridx);
    if (owner != null) {
      setPairs((p) => {
        const n = { ...p };
        delete n[owner];
        return n;
      });
      if (selLeft == null) return;
    }
    if (selLeft == null) return;
    setPairs((p) => ({ ...p, [selLeft]: ridx }));
    setSelLeft(null);
  }

  const allPaired = items && Object.keys(pairs).length === items.length;
  const correctCount = checked && items ? items.filter((_, i) => pairs[i] === i).length : 0;

  function check() {
    if (allPaired) setChecked(true);
  }

  function next() {
    if (onAdvance) onAdvance();
    else load();
  }

  const badge = (num, tone) => (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        tone === "ok"
          ? "bg-emerald-500 text-white"
          : tone === "bad"
          ? "bg-red-500 text-white"
          : "bg-primary text-primary-foreground"
      )}
    >
      {num}
    </span>
  );

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-7">
        {checked && (
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium">
              {correctCount} / {items.length}
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : err ? (
          <p className="p-4 text-center text-sm text-muted-foreground">{err}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {/* Левые половины */}
              <div className="flex flex-col gap-2">
                {leftOrder.map((idx) => {
                  const paired = pairs[idx] != null;
                  const tone = checked ? (pairs[idx] === idx ? "ok" : "bad") : "num";
                  return (
                    <button
                      key={idx}
                      onClick={() => clickLeft(idx)}
                      disabled={checked}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-3 text-left font-jp text-base transition-colors",
                        selLeft === idx && "ring-2 ring-primary",
                        checked && pairs[idx] === idx && "border-emerald-500/50 bg-emerald-500/5",
                        checked && pairs[idx] !== idx && "border-red-500/50 bg-red-500/5",
                        !checked && paired && "bg-muted/50",
                        !checked && "hover:bg-muted"
                      )}
                    >
                      {paired ? badge(pairNum[idx], tone) : <span className="size-6 shrink-0" />}
                      <span>{items[idx].left}</span>
                    </button>
                  );
                })}
              </div>

              {/* Правые половины */}
              <div className="flex flex-col gap-2">
                {rightOrder.map((ridx) => {
                  const owner = ownerOf(ridx);
                  const paired = owner != null;
                  const tone = checked ? (Number(owner) === ridx ? "ok" : "bad") : "num";
                  return (
                    <button
                      key={ridx}
                      onClick={() => clickRight(ridx)}
                      disabled={checked}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-3 text-left font-jp text-base transition-colors",
                        checked && Number(owner) === ridx && "border-emerald-500/50 bg-emerald-500/5",
                        checked && paired && Number(owner) !== ridx && "border-red-500/50 bg-red-500/5",
                        !checked && paired && "bg-muted/50",
                        !checked && "hover:bg-muted"
                      )}
                    >
                      {paired ? badge(pairNum[owner], tone) : <span className="size-6 shrink-0" />}
                      <span>{items[ridx].right}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Эталон после проверки */}
            {checked ? (
              <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4">
                {items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {pairs[i] === i ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-red-500" />
                    )}
                    <div>
                      <span className="font-jp">
                        {it.left}
                        {it.right}
                      </span>
                      <span className="text-muted-foreground"> — {it.russian}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex gap-2">
              {!checked ? (
                <button
                  className="fun-btn fun-primary flex-1"
                  onClick={check}
                  disabled={!allPaired}
                >
                  Проверить
                </button>
              ) : (
                <>
                  <button className="fun-btn fun-neutral" onClick={load}>
                    <RefreshCw className="size-4" /> Другие
                  </button>
                  <button className="fun-btn fun-primary flex-1" onClick={next}>
                    Дальше <ArrowRight className="size-4" />
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
