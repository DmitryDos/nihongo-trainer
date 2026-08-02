"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { POS_OPTIONS } from "@/lib/seed-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/native-select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Search, Loader2, Trash2 } from "lucide-react";

// Модалка редактирования состава пресета: добавляем/убираем слова.
export function PresetEditor({ presetId, open, onOpenChange, onSaved, onDeleted }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState("all");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !presetId) return;
    let alive = true;
    setLoading(true);
    setSearch("");
    setPos("all");
    Promise.all([api.preset(presetId), api.words({})])
      .then(([{ preset }, { words }]) => {
        if (!alive) return;
        setName(preset?.name || "");
        setSelected(new Set((preset?.wordIds || []).map(Number)));
        setWords(words);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [open, presetId]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return words.filter((w) => {
      if (pos !== "all" && w.pos !== pos) return false;
      if (!s) return true;
      return `${w.kanji} ${w.kana} ${w.russian}`.toLowerCase().includes(s);
    });
  }, [words, search, pos]);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Все ли слова под текущим фильтром уже в пресете (для кнопки «Выбрать/Исключить всё»).
  const allFilteredSelected = filtered.length > 0 && filtered.every((w) => selected.has(w.id));
  function toggleAllFiltered() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((w) => next.delete(w.id));
      else filtered.forEach((w) => next.add(w.id));
      return next;
    });
  }

  async function remove() {
    if (!confirm(`Удалить пресет «${name || ""}»?`)) return;
    setBusy(true);
    try {
      await api.deletePreset(presetId);
      onDeleted?.();
      onOpenChange(false);
      toast.success("Пресет удалён");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    try {
      const { preset } = await api.updatePreset({
        id: presetId,
        name: name.trim() || "Пресет",
        wordIds: [...selected],
      });
      onSaved?.(preset);
      onOpenChange(false);
      toast.success(`Пресет сохранён (${preset.count} слов)`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактирование пресета</DialogTitle>
        </DialogHeader>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название пресета"
          className="h-9"
        />

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск…"
              className="h-8 pl-8"
            />
          </div>
          <NativeSelect value={pos} onChange={(e) => setPos(e.target.value)}>
            <option value="all">Все части речи</option>
            {POS_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            В пресете: {selected.size} · под фильтром: {filtered.length}
          </div>
          <button
            className="fun-btn fun-neutral h-8 min-h-0 shrink-0 px-3 text-xs"
            onClick={toggleAllFiltered}
            disabled={loading || filtered.length === 0}
          >
            {allFilteredSelected ? "Исключить всё" : "Выбрать всё"}
          </button>
        </div>

        <div className="min-h-0 flex-1 divide-y overflow-y-auto rounded-lg border">
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">Ничего не найдено</p>
          ) : (
            filtered.map((w) => {
              const on = selected.has(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggle(w.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 p-3 text-left text-base transition-colors",
                    on ? "bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded border",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-input"
                    )}
                  >
                    {on ? <Check className="size-4" /> : null}
                  </span>
                  <span className="font-jp">{w.kanji || w.kana}</span>
                  {w.kanji ? <span className="font-jp text-sm text-muted-foreground">{w.kana}</span> : null}
                  <span className="truncate text-muted-foreground">— {w.russian}</span>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <button className="fun-btn fun-danger" onClick={remove} disabled={busy}>
            <Trash2 className="size-4" /> Удалить
          </button>
          <button className="fun-btn fun-primary" onClick={save} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Сохранить"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
