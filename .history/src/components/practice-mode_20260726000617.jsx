"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { checkAnswer, checkReading, checkRussian } from "@/lib/japanese";
import { hasKanji } from "@/lib/kanji";
import { KanjiPanel, useShiftHeld } from "@/components/kanji-breakdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, X, ArrowRight, HelpCircle, Loader2 } from "lucide-react";

export function PracticeMode({
  mode,
  filters,
  direction,
  onAnswered,
  learnMode = false,
  presetId,
  onAdvance,
  onDirectionChange,
  onLearnModeChange,
}) {
  // Направление важно только для карточек; для ввода чтения оно всегда "reading".
  const effDir = mode === "reading" ? "reading" : direction;

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState(""); // перевод
  const [reading, setReading] = useState(""); // чтение (только для двойного поля)
  const [fieldResult, setFieldResult] = useState(null); // { reading, tr } — итог по каждому полю
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [err, setErr] = useState(null);

  const composing = useRef(false);
  const inputRef = useRef(null);
  const readingRef = useRef(null);
  const lastId = useRef(null);
  const resolved = useRef(null); // итоговая правильность (учитывая «Принять ответ»)
  const posted = useRef(false);

  // Разбор кандзи показывается в панели справа: в режиме заучивания — автоматически
  // для текущего задания; иначе — только по Shift+клику (смена задания панель прячет).
  const [panelText, setPanelText] = useState(null);
  const shiftHeld = useShiftHeld();
  const kanjiProps = (text) => ({
    onMouseDown: (e) => e.shiftKey && e.preventDefault(),
    onClick: (e) => {
      if (e.shiftKey && hasKanji(text)) {
        e.preventDefault();
        setPanelText(text);
      }
    },
    // Двойной клик/тап = то же, что Shift+клик — чтобы на телефоне (без Shift)
    // тоже показывать разбор кандзи.
    onDoubleClick: (e) => {
      if (hasKanji(text)) {
        e.preventDefault();
        setPanelText(text);
      }
    },
    className: cn(
      hasKanji(text) && "select-none", // не выделять текст при даблтапе
      shiftHeld &&
        hasKanji(text) &&
        "cursor-help rounded-md underline decoration-dotted decoration-muted-foreground/40 underline-offset-8"
    ),
  });

  // Режим заучивания: автоматически показать разбор кандзи текущего слова и
  // обновлять при смене задания. Вне режима смена задания прячет панель.
  useEffect(() => {
    if (learnMode && word?.kanji && hasKanji(word.kanji)) setPanelText(word.kanji);
    else setPanelText(null);
  }, [word, learnMode]);

  const loadNext = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setStatus("idle");
    setInput("");
    setReading("");
    setFieldResult(null);
    resolved.current = null;
    posted.current = false;
    try {
      const { word: w, error } = await api.next({
        pos: filters.pos,
        topic: filters.topic,
        excludeId: lastId.current,
        presetId,
      });
      if (error || !w) {
        setWord(null);
        setErr(error || "Нет слов под выбранный фильтр");
      } else {
        setWord(w);
        lastId.current = w.id;
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
      setTimeout(() => (readingRef.current || inputRef.current)?.focus(), 30);
    }
  }, [filters.pos, filters.topic, presetId]);

  // Новое слово при монтировании и смене режима/направления/фильтров.
  useEffect(() => {
    loadNext();
  }, [loadNext, mode, effDir]);

  // Зафиксировать ответ (без отправки — отправка при переходе к следующему).
  function resolve(correct) {
    if (status !== "idle") return;
    resolved.current = correct;
    setStatus(correct ? "correct" : "wrong");
    setTimeout(() => inputRef.current?.focus(), 20);
  }

  // Двойное поле: в карточках при переводе с кандзи (JP→RU) вводим и чтение, и перевод.
  const dualField = mode === "flashcard" && effDir === "jp2ru" && !!word?.kanji;

  function submit() {
    if (!word || status !== "idle") return;
    if (dualField) {
      if (!reading.trim() && !input.trim()) return;
      const rOk = checkReading(reading, word);
      const tOk = checkRussian(input, word);
      setFieldResult({ reading: rOk, tr: tOk });
      resolve(rOk && tOk);
      return;
    }
    if (!input.trim()) return;
    resolve(checkAnswer(input, word, { mode, direction: effDir }));
  }

  // «Принять ответ» — засчитать как верное (например, если это была опечатка).
  function accept() {
    if (status !== "wrong") return;
    resolved.current = true;
    setStatus("correct");
  }

  async function postResult() {
    if (!word || status === "idle" || posted.current || resolved.current == null) return;
    posted.current = true;
    try {
      await api.attempt({
        wordId: word.id,
        correct: resolved.current,
        mode,
        direction: effDir,
      });
      onAnswered?.();
    } catch (e) {
      posted.current = false;
      toast.error(e.message);
    }
  }

  const advancing = useRef(false);
  async function advance() {
    if (advancing.current) return; // защита от двойного срабатывания
    advancing.current = true;
    try {
      await postResult();
      if (onAdvance) onAdvance(); // викторина: следующий вопрос выбирает родитель
      else await loadNext();
    } finally {
      advancing.current = false;
    }
  }

  // Единая обработка Enter — на keyUP, а не keydown. keydown авто-повторяется, пока
  // клавиша зажата, из-за чего одно удержание успевало и показать ответ, и перейти
  // дальше. keyup срабатывает один раз на отпускание → одно нажатие = одно действие.
  function handleEnter() {
    if (composing.current) return;
    if (status !== "idle") {
      advance();
      return;
    }
    // idle: в двойном поле Enter из строки чтения переводит фокус на перевод.
    if (dualField && document.activeElement === readingRef.current) {
      inputRef.current?.focus();
      return;
    }
    submit();
  }

  const handleEnterRef = useRef(handleEnter);
  handleEnterRef.current = handleEnter;

  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === "Enter") handleEnterRef.current();
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  // Что показываем в качестве вопроса.
  const promptJapanese =
    mode === "reading" || effDir === "jp2ru" ? word && (word.kanji || word.kana) : null;
  const promptRussian = effDir === "ru2jp" ? word?.russian : null;

  const placeholder =
    mode === "reading" ? "ひらがな или romaji…" : effDir === "ru2jp" ? "日本語…" : "перевод…";

  const jpInput = mode !== "flashcard" || effDir === "ru2jp";

  // Подсказка ОС о языке поля (влияет на автокоррекцию/предиктив клавиатуры;
  // сам выбор раскладки на iOS остаётся за пользователем — веб её не переключает).
  const inputLang = mode === "reading" || effDir === "ru2jp" ? "ja" : "ru";

  function answerBlock() {
    if (!word) return null;
    if (mode === "reading") {
      return (
        <>
          <div className="font-jp text-5xl">{word.kana}</div>
          <div className="text-2xl text-muted-foreground">{word.russian}</div>
        </>
      );
    }
    if (effDir === "ru2jp") {
      return (
        <>
          <div className="font-jp text-5xl">
            <span {...kanjiProps(word.kanji || word.kana)}>{word.kanji ? word.kanji : word.kana}</span>
          </div>
          {word.kanji && <div className="font-jp text-2xl text-muted-foreground">【{word.kana}】</div>}
        </>
      );
    }
    return (
      <>
        <div className="text-5xl font-medium">{word.russian}</div>
        <div className="font-jp text-2xl text-muted-foreground">{word.kana}</div>
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 min-[920px]:flex-row min-[920px]:items-start min-[920px]:justify-center">
      <Card className="w-full min-w-0 max-w-xl min-[920px]:w-auto min-[920px]:flex-1">
        <CardContent className="flex flex-col gap-4 p-4">
        {/* тулбар карточки: направление (слева) и режим заучивания (справа) */}
        {(onDirectionChange || onLearnModeChange) && (
          <div className="flex items-center justify-between gap-2">
            {onDirectionChange ? (
              <div className="flex gap-1 rounded-xl border p-1">
                <button
                  className={cn(
                    "rounded-lg px-3 py-1 text-sm font-semibold",
                    effDir === "jp2ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => onDirectionChange("jp2ru")}
                >
                  JP → RU
                </button>
                <button
                  className={cn(
                    "rounded-lg px-3 py-1 text-sm font-semibold",
                    effDir === "ru2jp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => onDirectionChange("ru2jp")}
                >
                  RU → JP
                </button>
              </div>
            ) : (
              <span />
            )}
            {onLearnModeChange && (
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium select-none">
                <input
                  type="checkbox"
                  checked={learnMode}
                  onChange={(e) => onLearnModeChange(e.target.checked)}
                  className="size-4 accent-primary"
                />
                заучивание
              </label>
            )}
          </div>
        )}

        {/* вопрос */}
        <div className="flex min-h-20 flex-col items-center justify-center gap-2 text-center">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : err ? (
            <p className="text-sm text-muted-foreground">{err}</p>
          ) : (
            <>
              {promptJapanese && (
                <div className="font-jp text-[40px] leading-tight tracking-wide break-words">
                  <span {...kanjiProps(promptJapanese)}>{promptJapanese}</span>
                </div>
              )}
              {promptRussian && <div className="text-[26px] font-semibold break-words">{promptRussian}</div>}
            </>
          )}
        </div>

        {/* поле ввода */}
        {!err && (
          <div className="flex flex-col gap-3">
            {dualField ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <span className="px-1 text-xs font-medium text-muted-foreground">
                    Чтение (романдзи / кана)
                  </span>
                  <Input
                    ref={readingRef}
                    value={reading}
                    disabled={status !== "idle" || loading}
                    onChange={(e) => setReading(e.target.value)}
                    onCompositionStart={() => (composing.current = true)}
                    onCompositionEnd={() => (composing.current = false)}
                    lang="ja"
                    placeholder="ひらがな или romaji…"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={cn(
                      "h-16 rounded-2xl text-center text-[16px] font-jp",
                      fieldResult &&
                        (fieldResult.reading
                          ? "border-emerald-500 ring-2 ring-emerald-500/30"
                          : "border-red-500 ring-2 ring-red-500/30")
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="px-1 text-xs font-medium text-muted-foreground">Перевод</span>
                  <Input
                    ref={inputRef}
                    value={input}
                    disabled={status !== "idle" || loading}
                    onChange={(e) => setInput(e.target.value)}
                    onCompositionStart={() => (composing.current = true)}
                    onCompositionEnd={() => (composing.current = false)}
                    lang="ru"
                    placeholder="перевод…"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={cn(
                      "h-16 rounded-2xl text-center text-[16px]",
                      fieldResult &&
                        (fieldResult.tr
                          ? "border-emerald-500 ring-2 ring-emerald-500/30"
                          : "border-red-500 ring-2 ring-red-500/30")
                    )}
                  />
                </div>
              </div>
            ) : (
              <Input
                ref={inputRef}
                value={input}
                disabled={status !== "idle" || loading}
                onChange={(e) => setInput(e.target.value)}
                onCompositionStart={() => (composing.current = true)}
                onCompositionEnd={() => (composing.current = false)}
                lang={inputLang}
                placeholder={placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className={cn(
                  "h-16 rounded-2xl text-center text-[22px]",
                  jpInput && "font-jp",
                  status === "correct" && "border-emerald-500 ring-2 ring-emerald-500/30",
                  status === "wrong" && "border-red-500 ring-2 ring-red-500/30"
                )}
              />
            )}

            {/* обратная связь */}
            {status !== "idle" && (
              <div
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-3 text-center",
                  status === "correct"
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-red-500/40 bg-red-500/5"
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
                {status === "wrong" &&
                  (dualField ? (
                    (reading.trim() || input.trim()) && (
                      <div className="text-xs text-muted-foreground">
                        ваш ответ: <span className="font-jp">{reading || "—"}</span>{" "}
                        {fieldResult && (fieldResult.reading ? "✓" : "✗")} · {input || "—"}{" "}
                        {fieldResult && (fieldResult.tr ? "✓" : "✗")}
                      </div>
                    )
                  ) : (
                    input.trim() && (
                      <div className="text-xs text-muted-foreground">
                        ваш ответ: <span className={jpInput ? "font-jp" : ""}>{input}</span>
                      </div>
                    )
                  ))}
                {answerBlock()}
              </div>
            )}

            {/* кнопки */}
            <div className="flex gap-2">
              {status === "idle" ? (
                <>
                  <button
                    className="fun-btn fun-primary flex-1"
                    onClick={submit}
                    disabled={dualField ? !(reading.trim() || input.trim()) : !input.trim()}
                  >
                    Проверить
                  </button>
                  <button
                    className="fun-btn fun-neutral"
                    onClick={() => {
                      if (dualField) setFieldResult({ reading: false, tr: false });
                      resolve(false);
                    }}
                  >
                    <HelpCircle className="size-4" /> Не знаю
                  </button>
                </>
              ) : (
                <>
                  {status === "wrong" && (
                    <button className="fun-btn fun-neutral" onClick={accept}>
                      <Check className="size-4" /> Принять
                    </button>
                  )}
                  <button className="fun-btn fun-primary flex-1" onClick={advance}>
                    Дальше <ArrowRight className="size-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {err && (
          <Button variant="outline" onClick={loadNext}>
            Обновить
          </Button>
        )}
        </CardContent>
      </Card>

      {panelText && hasKanji(panelText) && (
        <KanjiPanel
          text={panelText}
          onClose={() => {
            setPanelText(null);
            onLearnModeChange?.(false); // крестик закрытия снимает и режим заучивания
          }}
          className="w-full max-w-xl min-[920px]:w-80 min-[920px]:max-w-none min-[920px]:shrink-0"
        />
      )}
    </div>
  );
}
