"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { checkRussian, checkJapanese } from "@/lib/japanese";
import { POS_OPTIONS } from "@/lib/seed-data";
import { PresetBar } from "@/components/preset-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Check,
  X,
  Play,
  Loader2,
  ArrowLeft,
  Flag,
  ArrowRight,
  HelpCircle,
  Shuffle,
  Trophy,
} from "lucide-react";

const POS_LABEL = Object.fromEntries(POS_OPTIONS.map((p) => [p.value, p.label]));

// Направления теста. «both» — случайно японское/русское для каждого слова.
const DIRECTIONS = [
  { value: "jp2ru", label: "JP → RU" },
  { value: "ru2jp", label: "RU → JP" },
  { value: "both", label: "JP ⇄ RU" },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TestMode({ onAnswered }) {
  // setup — экран настроек, run — прохождение, stats — итоги
  const [phase, setPhase] = useState("setup");

  const [dirMode, setDirMode] = useState("jp2ru"); // настройка направления
  const [preset, setPreset] = useState("");
  const [loading, setLoading] = useState(false);

  const [queue, setQueue] = useState([]); // оставшиеся слова, текущее — queue[0]
  const [curDir, setCurDir] = useState("jp2ru"); // эффективное направление текущего слова

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | correct | wrong

  const [stats, setStats] = useState({ correct: 0, wrong: 0, returned: 0 });
  const [results, setResults] = useState([]); // { word, status: success | fail }

  const composing = useRef(false);
  const inputRef = useRef(null);

  // Случайное направление для «both», иначе фиксированное из настройки.
  const pickDir = useCallback(
    () => (dirMode === "both" ? (Math.random() < 0.5 ? "jp2ru" : "ru2jp") : dirMode),
    [dirMode]
  );

  const current = queue[0] || null;

  // ---------- Запуск ----------
  async function start() {
    setLoading(true);
    try {
      const { words } = await api.words({});
      let pool = words;
      if (preset) {
        const { preset: p } = await api.preset(preset);
        const ids = new Set((p?.wordIds || []).map(Number));
        pool = words.filter((w) => ids.has(w.id));
      }
      if (!pool.length) {
        toast.error("Нет слов для теста — выбери другой список.");
        return;
      }
      setQueue(shuffleArr(pool));
      setResults([]);
      setStats({ correct: 0, wrong: 0, returned: 0 });
      setInput("");
      setStatus("idle");
      setCurDir(pickDir());
      setPhase("run");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ---------- Переходы ----------
  const advancing = useRef(false);

  function startNext(nextQ) {
    if (!nextQ.length) {
      setQueue([]);
      setInput("");
      setStatus("idle");
      setPhase("stats");
      return;
    }
    setQueue(nextQ);
    setCurDir(pickDir());
    setInput("");
    setStatus("idle");
  }

  // outcome: success | fail | return
  function advance(outcome) {
    if (advancing.current) return;
    const cur = queue[0];
    if (!cur) return;
    advancing.current = true;
    try {
      if (outcome === "return") {
        // Замешиваем слово обратно в оставшуюся колоду (не первым, чтобы не выпало
        // сразу же). Ошибку не считаем.
        setStats((s) => ({ ...s, returned: s.returned + 1 }));
        const rest = queue.slice(1);
        const idx = rest.length ? 1 + Math.floor(Math.random() * rest.length) : 0;
        startNext([...rest.slice(0, idx), cur, ...rest.slice(idx)]);
        return;
      }
      const correct = outcome === "success";
      setStats((s) => ({
        ...s,
        correct: s.correct + (correct ? 1 : 0),
        wrong: s.wrong + (correct ? 0 : 1),
      }));
      setResults((r) => [...r, { word: cur, status: correct ? "success" : "fail" }]);
      api
        .attempt({ wordId: cur.id, correct, mode: "test", direction: curDir })
        .then(() => onAnswered?.())
        .catch(() => {});
      startNext(queue.slice(1));
    } finally {
      // отпускаем на следующий тик — защита от даблклика/автоповтора Enter
      setTimeout(() => (advancing.current = false), 0);
    }
  }

  function submit() {
    if (!current || status !== "idle" || !input.trim()) return;
    const ok = curDir === "ru2jp" ? checkJapanese(input, current) : checkRussian(input, current);
    setStatus(ok ? "correct" : "wrong");
  }

  // Enter: проверка → «Дальше». В идле пустой ввод игнорируем; после ответа
  // Enter = дальше (для верного — успех, для ошибки — засчитать ошибку).
  function handleEnter() {
    if (composing.current) return;
    if (phase !== "run") return;
    if (status === "idle") submit();
    else advance(status === "correct" ? "success" : "fail");
  }
  const handleEnterRef = useRef(handleEnter);
  useEffect(() => {
    handleEnterRef.current = handleEnter;
  });
  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === "Enter") handleEnterRef.current();
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  // Фокус в поле при показе нового слова.
  useEffect(() => {
    if (phase === "run" && status === "idle") inputRef.current?.focus();
  }, [phase, status, queue]);

  function exit() {
    setPhase("setup");
    setQueue([]);
  }

  // ======================= Экран настроек =======================
  if (phase === "setup") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        {/* Направление */}
        <div className="flex gap-1 rounded-xl border p-1">
          {DIRECTIONS.map((d) => {
            const on = dirMode === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setDirMode(d.value)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                  on ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Список слов — поповер вниз (экран настроек вверху страницы) */}
        <PresetBar presetId={preset} onChange={setPreset} openUp={false} />

        <button className="fun-btn fun-primary" onClick={start} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          Начать
        </button>
      </div>
    );
  }

  // ======================= Экран итогов =======================
  if (phase === "stats") {
    const fails = results.filter((r) => r.status === "fail");
    const wins = results.filter((r) => r.status === "success");
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {/* Сводка */}
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Правильных" value={stats.correct} tone="ok" />
          <StatBox label="Ошибок" value={stats.wrong} tone="bad" />
          <StatBox label="Замешиваний" value={stats.returned} tone="muted" />
        </div>

        {results.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Нет засчитанных слов.</p>
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            {fails.map((r) => (
              <WordRow key={`f${r.word.id}`} word={r.word} status="fail" />
            ))}
            {wins.map((r) => (
              <WordRow key={`w${r.word.id}`} word={r.word} status="success" />
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button className="fun-btn fun-neutral flex-1" onClick={exit}>
            <ArrowLeft className="size-4" /> К настройкам
          </button>
          <button className="fun-btn fun-primary flex-1" onClick={start} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Trophy className="size-4" />}
            Ещё раз
          </button>
        </div>
      </div>
    );
  }

  // ======================= Экран прохождения =======================
  const promptJp = curDir === "ru2jp" ? null : current && (current.kanji || current.kana);
  const promptRu = curDir === "ru2jp" ? current?.russian : null;
  const jpInput = curDir === "ru2jp";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      {/* Назад / Завершить — по краям */}
      <div className="flex items-center justify-between gap-2">
        <button className="fun-btn fun-neutral h-9 min-h-0 px-3 text-sm" onClick={exit}>
          <ArrowLeft className="size-4" /> Назад
        </button>
        <button className="fun-btn fun-danger h-9 min-h-0 px-3 text-sm" onClick={() => setPhase("stats")}>
          <Flag className="size-4" /> Завершить
        </button>
      </div>

      {/* Карточка задания — дизайн как в карточках */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex min-h-20 flex-col items-center justify-center gap-2 text-center">
            {promptJp && (
              <div className="font-jp text-[40px] leading-tight tracking-wide break-words">{promptJp}</div>
            )}
            {promptRu && <div className="text-[26px] font-semibold break-words">{promptRu}</div>}
          </div>

          <Input
            ref={inputRef}
            value={input}
            disabled={status !== "idle"}
            onChange={(e) => setInput(e.target.value)}
            onCompositionStart={() => (composing.current = true)}
            onCompositionEnd={() => (composing.current = false)}
            lang={jpInput ? "ja" : "ru"}
            placeholder={jpInput ? "日本語…" : "перевод…"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className={cn(
              "h-16 rounded-2xl text-center text-[16px]",
              jpInput && "font-jp",
              status === "correct" && "border-emerald-500 ring-2 ring-emerald-500/30",
              status === "wrong" && "border-red-500 ring-2 ring-red-500/30"
            )}
          />

          {/* Обратная связь */}
          {status !== "idle" && current && (
            <div
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-3 text-center",
                status === "correct" ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  status === "correct" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {status === "correct" ? (
                  <>
                    <Check className="size-4" /> Верно
                  </>
                ) : (
                  <>
                    <X className="size-4" /> Ошибка
                  </>
                )}
              </div>
              {status === "wrong" && input.trim() && (
                <div className="text-xs text-muted-foreground">
                  ваш ответ: <span className={jpInput ? "font-jp" : ""}>{input}</span>
                </div>
              )}
              {jpInput ? (
                <>
                  <div className="font-jp text-4xl">{current.kanji || current.kana}</div>
                  {current.kanji && (
                    <div className="font-jp text-xl text-muted-foreground">【{current.kana}】</div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-4xl font-medium">{current.russian}</div>
                  <div className="font-jp text-xl text-muted-foreground">{current.kana}</div>
                </>
              )}
            </div>
          )}

          {/* Кнопки — под ответом, как в карточках */}
          {status === "idle" ? (
            <div className="flex gap-2">
              <button className="fun-btn fun-primary flex-1" onClick={submit} disabled={!input.trim()}>
                Проверить
              </button>
              <button className="fun-btn fun-neutral" onClick={() => setStatus("wrong")}>
                <HelpCircle className="size-4" /> Не знаю
              </button>
            </div>
          ) : status === "correct" ? (
            <button className="fun-btn fun-primary w-full" onClick={() => advance("success")}>
              Дальше <ArrowRight className="size-4" />
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button className="fun-btn fun-neutral" onClick={() => advance("success")}>
                  <Check className="size-4" /> Принять
                </button>
                <button className="fun-btn fun-primary flex-1" onClick={() => advance("fail")}>
                  Дальше <ArrowRight className="size-4" />
                </button>
              </div>
              <button className="fun-btn fun-neutral w-full" onClick={() => advance("return")}>
                <Shuffle className="size-4" /> Замешать
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({ label, value, tone }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border p-3 text-center">
      <span
        className={cn(
          "text-2xl font-bold",
          tone === "ok" && "text-emerald-600",
          tone === "bad" && "text-red-600",
          tone === "muted" && "text-muted-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function WordRow({ word, status }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          status === "fail" ? "bg-red-500/15 text-red-600" : "bg-emerald-500/15 text-emerald-600"
        )}
      >
        {status === "fail" ? <X className="size-4" /> : <Check className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-jp text-lg">{word.kanji || word.kana}</span>
          {word.kanji ? <span className="font-jp text-sm text-muted-foreground">{word.kana}</span> : null}
        </div>
        <div className="truncate text-sm text-muted-foreground">{word.russian}</div>
      </div>
      <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
        {POS_LABEL[word.pos] || word.pos}
      </span>
    </div>
  );
}
