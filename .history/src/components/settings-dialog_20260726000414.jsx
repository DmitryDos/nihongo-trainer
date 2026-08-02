"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";
import { FONT_OPTIONS } from "@/lib/fonts";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const THEMES = [
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
  { value: "system", label: "Система" },
];

export function SettingsDialog({ settings, onChanged, onLevelChange, onFontChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const method = settings?.method || "none";
  const canGenerate = !!settings?.canGenerate;

  async function levelUp() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.levelup();
      setResult(res);
      toast.success(`Готово: весов изменено — ${res.adjusted}, новых слов — ${res.added}`);
      onChanged?.();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function changeLevel(v) {
    onLevelChange?.(v);
    api.setSetting("level", v).catch(() => {});
  }

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Настройки" onClick={() => setOpen(true)} className="size-12">
        <Settings className="size-8" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>Генерация, шрифт, сложность и тема.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 text-sm">
            {/* Генерация */}
            <div className="flex flex-col gap-1">
              <span className="font-medium">Генерация текстов</span>
              {method === "subscription" ? (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="size-4" /> Через Max-подписку (Claude Code) — без API-ключа
                </span>
              ) : method === "apikey" ? (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="size-4" /> Через API-ключ (ANTHROPIC_API_KEY)
                </span>
              ) : (
                <span className="flex items-start gap-1.5 text-amber-600">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Недоступно. Установи Claude Code и войди командой <code>claude</code> (или задай{" "}
                    <code>ANTHROPIC_API_KEY</code>) и перезапусти <code>pnpm dev</code>.
                  </span>
                </span>
              )}
            </div>

            <Separator />

            {/* Level up */}
            <div className="flex flex-col gap-2">
              <span className="font-medium">Пересмотр частот (Level up)</span>
              <p className="text-xs text-muted-foreground">
                Claude занизит частоту лёгких слов, поднимет проблемные и добавит несколько новых.
              </p>
              <button
                className="fun-btn fun-sky h-11 min-h-0"
                onClick={levelUp}
                disabled={loading || !canGenerate}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Пересмотреть частоты
              </button>
              {result && (
                <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                  <p>{result.note}</p>
                  <p className="mt-1 text-muted-foreground">
                    Изменено весов: {result.adjusted} · новых слов: {result.added}
                  </p>
                  {result.newWords?.length > 0 && (
                    <p className="font-jp mt-1">
                      {result.newWords.map((w) => `${w.kanji || w.kana}（${w.kana}）`).join("、")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Шрифт */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">Японский шрифт</span>
              <NativeSelect
                value={settings?.font || "noto"}
                onChange={(e) => onFontChange?.(e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <p className="font-jp -mt-3 text-2xl">日本語のれんしゅう · 猫は白いです</p>

            {/* Уровень */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Уровень текстов</span>
              <NativeSelect value={settings?.level || "N5"} onChange={(e) => changeLevel(e.target.value)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {/* Тема */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Тема</span>
              <div className="flex gap-1">
                {THEMES.map((t) => (
                  <Button
                    key={t.value}
                    size="sm"
                    variant={mounted && theme === t.value ? "default" : "outline"}
                    onClick={() => setTheme(t.value)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
