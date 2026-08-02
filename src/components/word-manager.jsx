"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { POS_OPTIONS } from "@/lib/seed-data";
import { WEIGHT_MAX } from "@/lib/weights";
import { hasKanji } from "@/lib/kanji";
import { cn } from "@/lib/utils";
import { useKanjiInspector, useShiftHeld } from "@/components/kanji-breakdown";
import { NativeSelect } from "@/components/native-select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";

const POS_LABEL = Object.fromEntries(POS_OPTIONS.map((p) => [p.value, p.label]));
const EMPTY = { kanji: "", kana: "", russian: "", pos: "noun" };

export function WordManager({ onChanged }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  // Shift+клик по кандзи — всплывающий разбор на радикалы и чтения.
  const { inspect, element: kanjiPopup } = useKanjiInspector();
  const shiftHeld = useShiftHeld();
  const kanjiProps = (text) => ({
    onMouseDown: (e) => e.shiftKey && e.preventDefault(),
    onClick: (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        inspect(text, e.currentTarget);
      }
    },
    className: cn(
      "font-jp text-xl",
      shiftHeld &&
        hasKanji(text) &&
        "cursor-help underline decoration-dotted decoration-muted-foreground/40 underline-offset-4"
    ),
  });

  const load = useCallback(async () => {
    try {
      const { words } = await api.words({ search, pos: posFilter });
      setList(words);
    } catch (e) {
      toast.error(e.message);
    }
  }, [search, posFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e) {
    e.preventDefault();
    if (!form.kana.trim() || !form.russian.trim()) {
      toast.error("Нужны чтение (кана) и перевод");
      return;
    }
    setBusy(true);
    try {
      await api.addWord(form);
      setForm({ ...EMPTY, pos: form.pos });
      toast.success("Слово добавлено");
      await load();
      onChanged?.();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(w) {
    if (!confirm(`Удалить «${w.kanji || w.kana}»?`)) return;
    try {
      await api.deleteWord(w.id);
      await load();
      onChanged?.();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {/* Добавление */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={add} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Input
                placeholder="Кандзи (необяз.)"
                value={form.kanji}
                onChange={(e) => setForm({ ...form, kanji: e.target.value })}
                className="font-jp"
              />
              <Input
                placeholder="Чтение (кана) *"
                value={form.kana}
                onChange={(e) => setForm({ ...form, kana: e.target.value })}
                className="font-jp"
              />
              <Input
                placeholder="Перевод *"
                value={form.russian}
                onChange={(e) => setForm({ ...form, russian: e.target.value })}
                className="col-span-2"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <NativeSelect
                value={form.pos}
                onChange={(e) => setForm({ ...form, pos: e.target.value })}
              >
                {POS_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </NativeSelect>
              <Button type="submit" disabled={busy} className="ml-auto">
                <Plus className="size-4" /> Добавить
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Поиск/фильтр */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8"
          />
        </div>
        <NativeSelect value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
          <option value="all">Все части речи</option>
          {POS_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </NativeSelect>
        <span className="text-xs text-muted-foreground">{list.length}</span>
      </div>

      {/* Список */}
      <div className="flex flex-col divide-y rounded-lg border">
        {list.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Ничего не найдено</p>
        )}
        {list.map((w) => {
          const total = w.correct + w.wrong;
          const acc = total ? Math.round((w.correct / total) * 100) : null;
          const freq = Math.min(100, (w.weight / WEIGHT_MAX) * 100);
          return (
            <div key={w.id} className="flex flex-col gap-1.5 p-3">
              {/* Верх: часть речи + частота (полоска и текст в одну строку), справа корзина */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="shrink-0">
                  {POS_LABEL[w.pos] || w.pos}
                </Badge>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary/60" style={{ width: `${freq}%` }} />
                  </div>
                  <span className="truncate text-[10px] text-muted-foreground">
                    частота · {acc == null ? "—" : `${acc}% верно`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(w)}
                  aria-label="Удалить"
                  className="shrink-0"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </div>
              {/* Низ: слово + чтение, перевод */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span {...kanjiProps(w.kanji || w.kana)}>{w.kanji || w.kana}</span>
                  {w.kanji ? (
                    <span className="font-jp text-sm text-muted-foreground">{w.kana}</span>
                  ) : null}
                </div>
                <div className="truncate text-sm text-muted-foreground">{w.russian}</div>
              </div>
            </div>
          );
        })}
      </div>
      {kanjiPopup}
    </div>
  );
}
