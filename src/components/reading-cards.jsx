"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { hasKanji } from "@/lib/kanji";
import { KanjiPanel, useShiftHeld } from "@/components/kanji-breakdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, ArrowRight, Loader2 } from "lucide-react";

// Вкладка «Чтение»: простые карточки (как домашний виджет), без ввода.
// Выбор направления, кнопка «Показать» открывает перевод снизу и оставляет
// одну большую кнопку «Дальше» (следующее случайное слово).
export function ReadingCards({ filters, presetId }) {
  const [direction, setDirection] = useState("jp2ru");
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [err, setErr] = useState(null);
  const lastId = useRef(null);

  // Разбор кандзи в панели: по Shift+клику (десктоп) или двойному тапу (телефон).
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
    onDoubleClick: (e) => {
      if (hasKanji(text)) {
        e.preventDefault();
        setPanelText(text);
      }
    },
    className: cn(
      hasKanji(text) && "select-none",
      shiftHeld &&
        hasKanji(text) &&
        "cursor-help rounded-md underline decoration-dotted decoration-muted-foreground/40 underline-offset-8"
    ),
  });

  const loadNext = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setRevealed(false);
    setPanelText(null);
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
    }
  }, [filters.pos, filters.topic, presetId]);

  // Новое слово при монтировании и смене фильтров/пресета.
  useEffect(() => {
    loadNext();
  }, [loadNext]);

  // Смена направления не грузит новое слово — просто снова прячем перевод.
  useEffect(() => {
    setRevealed(false);
  }, [direction]);

  const jp = word && (word.kanji || word.kana);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 min-[920px]:flex-row min-[920px]:items-start min-[920px]:justify-center">
      <Card className="w-full min-w-0 max-w-xl min-[920px]:w-auto min-[920px]:flex-1">
        <CardContent className="flex flex-col gap-4 p-4">
          {/* выбор языка */}
          <div className="flex gap-1 self-center rounded-xl border p-1">
            <button
              className={cn(
                "rounded-lg px-3 py-1 text-sm font-semibold",
                direction === "jp2ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
              onClick={() => setDirection("jp2ru")}
            >
              JP → RU
            </button>
            <button
              className={cn(
                "rounded-lg px-3 py-1 text-sm font-semibold",
                direction === "ru2jp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
              onClick={() => setDirection("ru2jp")}
            >
              RU → JP
            </button>
          </div>

          {/* карточка */}
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
            {loading ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : err ? (
              <p className="text-sm text-muted-foreground">{err}</p>
            ) : direction === "jp2ru" ? (
              <>
                {/* вопрос — японский */}
                <div className="font-jp text-[40px] leading-tight tracking-wide break-words">
                  <span {...kanjiProps(jp)}>{jp}</span>
                </div>
                {/* ответ — чтение + перевод */}
                {revealed && (
                  <div className="flex flex-col items-center gap-1 border-t pt-3">
                    {word.kanji && (
                      <div className="font-jp text-2xl text-muted-foreground">【{word.kana}】</div>
                    )}
                    <div className="text-[26px] font-semibold break-words">{word.russian}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* вопрос — русский */}
                <div className="text-[30px] font-semibold break-words">{word?.russian}</div>
                {/* ответ — японский + чтение */}
                {revealed && (
                  <div className="flex flex-col items-center gap-1 border-t pt-3">
                    <div className="font-jp text-[40px] leading-tight tracking-wide break-words">
                      <span {...kanjiProps(jp)}>{jp}</span>
                    </div>
                    {word.kanji && (
                      <div className="font-jp text-2xl text-muted-foreground">【{word.kana}】</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* кнопки */}
          {err ? (
            <Button variant="outline" onClick={loadNext}>
              Обновить
            </Button>
          ) : revealed ? (
            // после «Показать» — одна большая кнопка «Дальше»
            <button className="fun-btn fun-primary min-h-16 w-full text-lg" onClick={loadNext} disabled={loading}>
              Дальше <ArrowRight className="size-5" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="fun-btn fun-primary flex-1"
                onClick={() => setRevealed(true)}
                disabled={loading || !word}
              >
                <Eye className="size-4" /> Показать
              </button>
              <button className="fun-btn fun-neutral" onClick={loadNext} disabled={loading}>
                Дальше <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {panelText && hasKanji(panelText) && (
        <KanjiPanel
          text={panelText}
          onClose={() => setPanelText(null)}
          className="w-full max-w-xl min-[920px]:w-80 min-[920px]:max-w-none min-[920px]:shrink-0"
        />
      )}
    </div>
  );
}
