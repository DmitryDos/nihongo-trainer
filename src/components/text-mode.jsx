"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api";
import { analyzeText } from "@/lib/analyze";
import { AnnotatedText } from "@/components/annotated-text";
import { KanjiPanel } from "@/components/kanji-breakdown";
import { NativeSelect } from "@/components/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowLeft, Trash2, Save, List, Shuffle, ArrowRight } from "lucide-react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export function TextMode({ kind, filters, level = "N5", canGenerate, onAnswered, onNeedGen, onAdvance }) {
  const isSentence = kind === "sentence";
  const title = isSentence ? "Предложения" : "Тексты";

  const [list, setList] = useState([]);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lvl, setLvl] = useState(level);
  const [genLoading, setGenLoading] = useState(false);

  const [direction, setDirection] = useState("jp2ru");
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [missed, setMissed] = useState(() => new Set());
  const [saved, setSaved] = useState(false);
  const [peek, setPeek] = useState(false);
  const [panelSeg, setPanelSeg] = useState(null); // слово для блока-подсказки

  const loadList = useCallback(async () => {
    try {
      const { texts } = await api.texts(kind);
      setList(texts);
    } catch (e) {
      toast.error(e.message);
    }
  }, [kind]);

  useEffect(() => {
    loadList();
    api.words({}).then(({ words: w }) => setWords(w)).catch(() => {});
  }, [loadList]);

  // Отслеживаем Shift для режима подсказок (peek).
  useEffect(() => {
    const down = (e) => e.key === "Shift" && setPeek(true);
    const up = (e) => e.key === "Shift" && setPeek(false);
    const blur = () => setPeek(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  const segments = useMemo(
    () => (selected ? analyzeText(selected.japanese, words) : []),
    [selected, words]
  );
  const knownIds = useMemo(
    () => [...new Set(segments.filter((s) => s.wordId).map((s) => s.wordId))],
    [segments]
  );

  function open(t) {
    setSelected(t);
    setDirection("jp2ru");
    setInput("");
    setRevealed(false);
    setMissed(new Set());
    setSaved(false);
    setPanelSeg(null);
  }

  function pickRandom() {
    if (list.length) open(list[Math.floor(Math.random() * list.length)]);
  }

  // По умолчанию показываем случайное; список — по кнопке «Выбрать».
  useEffect(() => {
    if (!selected && list.length) open(list[Math.floor(Math.random() * list.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  function toggleMissed(wordId) {
    setMissed((prev) => {
      const next = new Set(prev);
      next.has(wordId) ? next.delete(wordId) : next.add(wordId);
      return next;
    });
  }

  async function generate() {
    if (!canGenerate) {
      onNeedGen?.();
      return;
    }
    setGenLoading(true);
    try {
      const { text } = await api.generate({ kind, level: lvl, pos: filters.pos });
      setList((prev) => [text, ...prev]);
      open(text);
      toast.success("Сгенерировано");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setGenLoading(false);
    }
  }

  async function removeText(t, e) {
    e?.stopPropagation();
    if (!confirm("Удалить этот текст?")) return;
    try {
      await api.deleteText(t.id);
      setList((prev) => prev.filter((x) => x.id !== t.id));
      if (selected?.id === t.id) setSelected(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function saveResult() {
    if (!knownIds.length) {
      toast.info("В тексте нет слов из базы для учёта.");
      setSaved(true);
      return;
    }
    const results = knownIds.map((id) => ({ wordId: id, correct: !missed.has(id) }));
    try {
      await api.attempt({ results, mode: "story", direction });
      onAnswered?.();
      setSaved(true);
      toast.success(`Учтено слов: ${knownIds.length}, ошибок: ${missed.size}. Частоты обновлены.`);
    } catch (e) {
      toast.error(e.message);
    }
  }

  // ---------- История ----------
  if (!selected) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <NativeSelect value={lvl} onChange={(e) => setLvl(e.target.value)}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </NativeSelect>
            <button
              className="fun-btn fun-primary h-11 min-h-0 px-4 text-sm"
              onClick={generate}
              disabled={genLoading}
            >
              {genLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Сгенерировать
            </button>
          </div>
        </div>

        {!canGenerate && (
          <p className="text-sm text-muted-foreground">
            Генерация новых — через Claude Code (твоя Max-подписка). Сейчас недоступна: проверь, что
            вошёл в <code>claude</code>.
          </p>
        )}

        <div className="grid gap-2">
          {list.map((t) => (
            <button
              key={t.id}
              onClick={() => open(t)}
              className="group flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {t.title ? <span className="font-semibold">{t.title}</span> : null}
                  <Badge variant="outline" className="text-[10px]">
                    {t.level}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {t.source === "preset" ? "заготовка" : "своё"}
                  </Badge>
                </div>
                <p
                  className={`font-jp mt-1 line-clamp-1 text-lg ${
                    t.title ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {t.japanese}
                </p>
              </div>
              {t.source !== "preset" && (
                <span
                  role="button"
                  onClick={(e) => removeText(t, e)}
                  className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </span>
              )}
            </button>
          ))}
          {list.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">Пусто</p>
          )}
        </div>
      </div>
    );
  }

  // ---------- Чтение выбранного ----------
  const jp2ru = direction === "jp2ru";
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 min-[920px]:flex-row min-[920px]:items-start min-[920px]:justify-center">
      <div className="flex w-full min-w-0 max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            className="fun-btn fun-neutral h-10 min-h-0 px-3 text-sm"
            onClick={() => setSelected(null)}
          >
            <List className="size-4" /> Выбрать
          </button>
          <button
            className="fun-btn fun-neutral h-10 min-h-0 px-3 text-sm"
            onClick={pickRandom}
          >
            <Shuffle className="size-4" /> Другое
          </button>
        </div>
        <div className="flex gap-1 rounded-2xl border p-1">
          <button
            className={`rounded-xl px-3 py-1 text-sm font-semibold ${jp2ru ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setDirection("jp2ru")}
          >
            JP → RU
          </button>
          <button
            className={`rounded-xl px-3 py-1 text-sm font-semibold ${!jp2ru ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setDirection("ru2jp")}
          >
            RU → JP
          </button>
        </div>
      </div>

      {selected.title ? <h2 className="text-xl font-bold">{selected.title}</h2> : null}

      {/* Задание */}
      <div className="rounded-2xl border bg-muted/30 p-5">
        {jp2ru ? (
          <AnnotatedText
            segments={segments}
            peek={peek}
            onToggleMissed={toggleMissed}
            onSelect={setPanelSeg}
            activeId={panelSeg?.wordId}
            big
          />
        ) : (
          <p className="text-xl leading-relaxed">{selected.russian}</p>
        )}
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={jp2ru ? "Ваш перевод на русский…" : "日本語で…"}
        className={jp2ru ? "min-h-28 rounded-2xl text-base" : "min-h-28 rounded-2xl font-jp text-lg"}
      />

      {revealed && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Эталон
          </span>
          <div className="rounded-2xl border bg-muted/30 p-5">
            {jp2ru ? (
              <p className="text-xl leading-relaxed">{selected.russian}</p>
            ) : (
              <AnnotatedText
                segments={segments}
                peek={peek}
                missed={missed}
                onToggleMissed={toggleMissed}
                big
              />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          className={`fun-btn ${revealed ? "fun-neutral" : "fun-sky"} flex-1`}
          onClick={() => setRevealed((v) => !v)}
        >
          {revealed ? "Скрыть эталон" : "Показать перевод"}
        </button>
        <button className="fun-btn fun-primary" onClick={saveResult} disabled={saved}>
          <Save className="size-4" /> {saved ? "Сохранено" : "Сохранить"}
        </button>
        {onAdvance && (
          <button className="fun-btn fun-primary" onClick={onAdvance}>
            Дальше <ArrowRight className="size-4" />
          </button>
        )}
      </div>
      </div>

      {panelSeg && (
        <KanjiPanel
          text={panelSeg.text}
          subtitle={[panelSeg.reading, panelSeg.meaning].filter(Boolean).join(" · ")}
          onClose={() => setPanelSeg(null)}
          className="w-full max-w-2xl min-[920px]:w-80 min-[920px]:max-w-none min-[920px]:shrink-0"
        />
      )}
    </div>
  );
}
