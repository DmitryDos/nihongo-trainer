"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PracticeMode } from "@/components/practice-mode";
import { MatchingMode } from "@/components/matching-mode";
import { TextMode } from "@/components/text-mode";
import { cn } from "@/lib/utils";

// Режимы, которые можно включать/выключать в пуле викторины (чипсы-тоглы).
const MODES = [
  { key: "flashcard", label: "Карточки" },
  { key: "reading", label: "Чтение" },
  { key: "matching", label: "Пары" },
  { key: "sentence", label: "Предложения" },
  { key: "text", label: "Тексты" },
];

// Задания для включённых режимов (у карточек — два направления).
function tasksFor(enabled) {
  const t = [];
  if (enabled.has("flashcard")) {
    t.push({ type: "flashcard", direction: "jp2ru" });
    t.push({ type: "flashcard", direction: "ru2jp" });
  }
  if (enabled.has("reading")) t.push({ type: "reading", direction: "reading" });
  if (enabled.has("matching")) t.push({ type: "matching" });
  if (enabled.has("sentence")) t.push({ type: "sentence" });
  if (enabled.has("text")) t.push({ type: "text" });
  return t;
}

function pickTask(pool, prev) {
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let t;
  do {
    t = pool[Math.floor(Math.random() * pool.length)];
  } while (prev && t.type === prev.type && t.direction === prev.direction);
  return t;
}

export function QuizMode({ presetId, filters, onAnswered }) {
  const [enabled, setEnabled] = useState(() => new Set(["flashcard", "reading", "matching"]));
  const [round, setRound] = useState(0);
  const [task, setTask] = useState({ type: "flashcard", direction: "jp2ru" });

  const pool = useMemo(() => tasksFor(enabled), [enabled]);

  // Первый случайный выбор — на клиенте (без hydration-mismatch).
  useEffect(() => {
    setTask((prev) => pickTask(pool, null) || prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = useCallback(() => {
    setTask((prev) => pickTask(pool, prev) || prev);
    setRound((r) => r + 1);
  }, [pool]);

  function toggle(key) {
    setEnabled((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(key)) {
        if (nextSet.size > 1) nextSet.delete(key); // хотя бы один режим должен остаться
      } else nextSet.add(key);
      return nextSet;
    });
  }

  // Если текущее задание вылетело из пула (режим выключили) — берём новое.
  useEffect(() => {
    const stillIn = pool.some((p) => p.type === task.type && p.direction === task.direction);
    if (!stillIn) {
      setTask(pickTask(pool, null) || task);
      setRound((r) => r + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  return (
    <div className="flex flex-col gap-3">
      {/* Чипсы-тоглы в стиле сегмент-контрола (как нижнее меню): серая подложка,
          активный режим — белый блок. */}
      <div className="mx-auto flex flex-wrap justify-center gap-1 rounded-xl border bg-muted p-1">
        {MODES.map((m) => {
          const on = enabled.has(m.key);
          return (
            <button
              key={m.key}
              onClick={() => toggle(m.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                on
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {task.type === "matching" ? (
        <MatchingMode key={`m${round}`} presetId={presetId} onAdvance={next} />
      ) : task.type === "sentence" || task.type === "text" ? (
        <TextMode
          key={`t${round}`}
          kind={task.type}
          filters={filters}
          onAnswered={onAnswered}
          onAdvance={next}
        />
      ) : (
        <PracticeMode
          key={`p${round}`}
          mode={task.type}
          direction={task.direction}
          filters={filters}
          presetId={presetId}
          onAnswered={onAnswered}
          onAdvance={next}
        />
      )}
    </div>
  );
}
