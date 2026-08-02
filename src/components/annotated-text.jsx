"use client";

import { cn } from "@/lib/utils";

// segments: [{ text, wordId?, reading?, meaning? }]
// Без Shift текст не реагирует (просто читаешь). Клик при Shift (peek) или двойной
// клик/тап по слову открывает блок-подсказку (родитель через onSelect) и помечает
// слово как незнакомое (onToggleMissed → частота вырастет). activeId подсвечивает
// слово, для которого открыта панель.
export function AnnotatedText({
  segments,
  peek = false,
  onToggleMissed,
  onSelect,
  activeId,
  big = false,
  className,
}) {
  return (
    <p
      className={cn(
        "font-jp leading-loose tracking-wide",
        big ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        peek && "select-none",
        className
      )}
    >
      {(segments || []).map((s, i) => {
        if (!s.wordId) return <span key={i}>{s.text}</span>;
        const active = activeId != null && s.wordId === activeId;
        const handle = () => {
          onSelect?.(s);
          onToggleMissed?.(s.wordId);
        };
        return (
          <span
            key={i}
            onMouseDown={(e) => {
              // не выделять текст: при зажатом Shift и при двойном клике/тапе
              if (peek || e.detail > 1) e.preventDefault();
            }}
            onClick={peek ? handle : undefined}
            onDoubleClick={handle}
            className={cn(
              "cursor-pointer rounded-[3px] transition-colors",
              active && "bg-primary/10 ring-1 ring-primary/50",
              peek && "ring-1 ring-transparent hover:bg-primary/10 hover:ring-primary/50"
            )}
          >
            {s.text}
          </span>
        );
      })}
    </p>
  );
}
