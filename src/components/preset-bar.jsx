"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { POS_OPTIONS } from "@/lib/seed-data";
import { NativeSelect } from "@/components/native-select";
import { PresetEditor } from "@/components/preset-editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronDown, Pencil, Star, Sparkles, Loader2, Check } from "lucide-react";

// «Умный» селектор пресета: выглядит как обычный селект, при клике — список
// пресетов с карандашами + строковые кнопки «Создать» / «Сгенерировать».
// openUp — открывать список вверх (по умолчанию, для нижней панели фильтров);
// на верхних экранах передают openUp={false}, чтобы список падал вниз.
export function PresetBar({ presetId, onChange, openUp = true }) {
  const [presets, setPresets] = useState([]);
  const [open, setOpen] = useState(false);
  const [showGen, setShowGen] = useState(false);
  const [group, setGroup] = useState("all");
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    try {
      const { presets } = await api.presets();
      setPresets(presets);
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = presets.find((x) => String(x.id) === String(presetId));

  function select(id) {
    onChange(id);
    setOpen(false);
  }

  async function generate(body) {
    setBusy(true);
    try {
      const { preset } = await api.createPreset(body);
      await load();
      onChange(String(preset.id));
      setOpen(false);
      setShowGen(false);
      toast.success(`Пресет: ${preset.name}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function createEmpty() {
    setBusy(true);
    try {
      const { preset } = await api.createPreset({ mode: "empty", name: "Новый пресет" });
      await load();
      onChange(String(preset.id));
      setOpen(false);
      setEditId(preset.id);
      setEditorOpen(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  function edit(id) {
    setEditId(id);
    setEditorOpen(true);
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors hover:bg-muted/40 dark:bg-input/30"
      >
        <span className="truncate">{active ? active.name : "Все слова"}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 z-30 w-64 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg",
              openUp ? "bottom-full mb-1" : "top-full mt-1"
            )}
          >
            {/* Строковые действия */}
            <div className="flex items-center gap-4 border-b px-3 py-2 text-sm">
              <button
                onClick={createEmpty}
                disabled={busy}
                className="font-medium text-primary hover:underline disabled:opacity-50"
              >
                Создать
              </button>
              <button
                onClick={() => setShowGen((g) => !g)}
                className="font-medium text-primary hover:underline"
              >
                Сгенерировать
              </button>
              {busy ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
            </div>

            {showGen ? (
              <div className="flex flex-col gap-2 border-b bg-muted/30 px-3 py-2.5">
                <div className="flex gap-2">
                  <NativeSelect
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="h-8 flex-1"
                  >
                    <option value="all">Все части речи</option>
                    {POS_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </NativeSelect>
                  <button
                    onClick={() => generate({ mode: "pos", pos: group, count: 20 })}
                    disabled={busy}
                    className="fun-btn fun-neutral h-8 min-h-0 px-2.5 text-sm"
                  >
                    <Sparkles className="size-4" /> 20
                  </button>
                </div>
                <button
                  onClick={() => generate({ mode: "weakest", count: 20 })}
                  disabled={busy}
                  className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline dark:text-sky-400"
                >
                  <Star className="size-4" /> 20 самых ошибочных
                </button>
              </div>
            ) : null}

            {/* Список пресетов */}
            <div className="max-h-56 overflow-y-auto py-1">
              <button
                onClick={() => select("")}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted",
                  !presetId && "font-medium"
                )}
              >
                <span className="flex size-4 shrink-0 items-center justify-center">
                  {!presetId ? <Check className="size-4 text-primary" /> : null}
                </span>
                Все слова
              </button>

              {presets.map((p) => {
                const on = String(p.id) === String(presetId);
                return (
                  <div
                    key={p.id}
                    className={cn("flex items-center gap-1 pr-2 hover:bg-muted", on && "bg-primary/5")}
                  >
                    <button
                      onClick={() => select(String(p.id))}
                      className="flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5 text-left text-sm"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {on ? <Check className="size-4 text-primary" /> : null}
                      </span>
                      <span className="truncate">{p.name}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{p.count}</span>
                    </button>
                    <button
                      onClick={() => edit(p.id)}
                      aria-label="Редактировать"
                      className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      <PresetEditor
        presetId={editId}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSaved={() => load()}
        onDeleted={() => {
          onChange("");
          load();
        }}
      />
    </div>
  );
}
