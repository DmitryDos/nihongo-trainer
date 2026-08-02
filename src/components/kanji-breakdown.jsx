"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import { hasKanji } from "@/lib/kanji";
import { cn } from "@/lib/utils";
import { Loader2, X, GripHorizontal } from "lucide-react";

// Глобальное отслеживание зажатого Shift — для визуального намёка,
// что по кандзи можно кликнуть (курсор-подсказка + подчёркивание).
export function useShiftHeld() {
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const down = (e) => e.key === "Shift" && setHeld(true);
    const up = (e) => e.key === "Shift" && setHeld(false);
    const blur = () => setHeld(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  return held;
}

// Инспектор разбора кандзи. Использование:
//   const { inspect, element } = useKanjiInspector();
//   <span onClick={(e) => e.shiftKey && (e.preventDefault(), inspect(word.kanji, e.currentTarget))}>…</span>
//   {element}
export function useKanjiInspector() {
  const [state, setState] = useState(null); // { text, rect, items, loading, error }
  const reqId = useRef(0);

  const inspect = useCallback((text, target) => {
    const str = String(text || "");
    if (!hasKanji(str)) return false; // нет кандзи — показывать нечего
    const rect = target?.getBoundingClientRect?.() || null;
    const id = ++reqId.current;
    setState({ text: str, rect, items: null, loading: true, error: null });
    api
      .kanji(str)
      .then((res) => {
        if (id === reqId.current)
          setState((s) => (s ? { ...s, items: res.items || [], loading: false } : s));
      })
      .catch((e) => {
        if (id === reqId.current)
          setState((s) => (s ? { ...s, error: e.message, loading: false } : s));
      });
    return true;
  }, []);

  const close = useCallback(() => {
    reqId.current++;
    setState(null);
  }, []);

  // Без key: если виджет уже открыт, новый разбор меняет содержимое на месте,
  // не пересоздавая окно и не сдвигая его. Новое окно появляется только когда
  // предыдущего не было (переход null → state).
  const element = state ? <KanjiPopover state={state} onClose={close} /> : null;
  return { inspect, close, element };
}

function Readings({ label, jp, list }) {
  if (!list?.length) return null;
  return (
    <div className="flex gap-1.5 text-lg">
      <span className="shrink-0 text-muted-foreground">
        <span className="font-jp">{jp}</span> {label}:
      </span>
      <span className="font-jp">{list.join("、")}</span>
    </div>
  );
}

// Радикал-компонент с ролью: «смысл» (зелёный) или «звук» (голубой).
function RoleRow({ role, char, meaning, on }) {
  const sound = role === "звук";
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-lg border font-jp text-3xl",
          sound
            ? "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        )}
      >
        {char}
      </span>
      <div className="min-w-0 text-sm">
        <div>
          <span className={cn("font-semibold", sound ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400")}>
            {sound ? "звук" : "смысл"}
          </span>
          {meaning ? <span className="text-muted-foreground"> · {meaning}</span> : null}
        </div>
        {sound && on?.length ? (
          <div className="font-jp text-muted-foreground">подсказывает 音: {on.join("、")}</div>
        ) : null}
      </div>
    </div>
  );
}

export function KanjiCard({ k }) {
  const e = k.etym;
  const onlySelf = k.parts.length === 1 && k.parts[0].char === k.char;
  const showParts = !e || (!e.semantic && !e.phonetic); // визуальные части, если нет разбора смысл/звук
  return (
    <div className="flex gap-4">
      <div className="flex shrink-0 flex-col items-center">
        <span className="font-jp text-6xl leading-none">{k.char}</span>
        {k.strokes ? (
          <span className="mt-1.5 text-sm text-muted-foreground">{k.strokes} черт</span>
        ) : null}
        {e?.type ? (
          <span className="mt-1 rounded bg-muted px-1.5 py-0.5 font-jp text-xs text-muted-foreground">
            {e.type}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        {!k.known ? (
          <p className="text-lg text-muted-foreground">нет данных по этому знаку</p>
        ) : (
          <>
            {k.meaning ? <p className="text-lg font-medium">{k.meaning}</p> : null}
            <div className="mt-1 flex flex-col gap-0.5">
              <Readings label="он" jp="音" list={k.on} />
              <Readings label="кун" jp="訓" list={k.kun} />
            </div>

            {e && (e.semantic || e.phonetic) ? (
              <div className="mt-3 flex flex-col gap-2">
                {e.typeRu ? (
                  <p className="text-xs text-muted-foreground">
                    {e.type ? <span className="font-jp">{e.type}</span> : null} {e.typeRu}
                  </p>
                ) : null}
                {e.semantic ? (
                  <RoleRow role="смысл" char={e.semantic.char} meaning={e.semantic.meaning} />
                ) : null}
                {e.phonetic ? (
                  <RoleRow role="звук" char={e.phonetic.char} meaning={e.phonetic.meaning} on={e.phonetic.on} />
                ) : null}
              </div>
            ) : null}

            {showParts && !onlySelf && k.parts.length ? (
              <div className="mt-2.5">
                <p className="mb-1.5 text-base text-muted-foreground">
                  {e?.typeRu ? (
                    <>
                      <span className="font-jp">{e.type}</span> {e.typeRu} — состоит из:
                    </>
                  ) : (
                    "состоит из:"
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {k.parts.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-baseline gap-1.5 rounded-md border bg-muted/50 px-2 py-1"
                    >
                      <span className="font-jp text-2xl leading-none">{p.char}</span>
                      {p.meaning ? (
                        <span className="text-base text-muted-foreground">{p.meaning}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {showParts && onlySelf ? (
              <p className="mt-2 text-base text-muted-foreground">
                {e?.typeRu ? (
                  <>
                    <span className="font-jp">{e.type}</span> {e.typeRu}
                  </>
                ) : (
                  "неделимый знак (сам радикал)"
                )}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

// Встроенная панель разбора (не плавающая) — рядом с заданием.
// Тянет разбор для `text` и обновляется при его смене.
export function KanjiPanel({ text, subtitle, onClose, className }) {
  const [state, setState] = useState({ loading: true, items: null, error: null });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, items: null, error: null });
    api
      .kanji(text)
      .then((r) => alive && setState({ loading: false, items: r.items || [], error: null }))
      .catch((e) => alive && setState({ loading: false, items: null, error: e.message }));
    return () => {
      alive = false;
    };
  }, [text]);

  return (
    <aside
      className={cn(
        "relative rounded-2xl border bg-card text-card-foreground",
        className
      )}
    >
      {/* Панель фиксированной ширины: справа, пока влезает; иначе переносится вниз
          (см. контейнер в practice-mode). Высота — по содержимому, с капом и скроллом. */}
      <div className="flex flex-col rounded-2xl">
        <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
        <span className="min-w-0 truncate">
          <span className="font-jp text-xl">{text}</span>
          {subtitle ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">{subtitle}</span>
          ) : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">разбор</span>
          {onClose ? (
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </span>
      </div>
      <div className="p-5">
        {state.loading ? (
          <div className="flex items-center gap-2 py-2 text-lg text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> загрузка…
          </div>
        ) : state.error ? (
          <p className="text-lg text-red-500">{state.error}</p>
        ) : state.items?.length ? (
          <div className="flex flex-col gap-5">
            {state.items.map((k, i) => (
              <KanjiCard key={i} k={k} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">в слове нет кандзи</p>
        )}
        </div>
      </div>
    </aside>
  );
}

function KanjiPopover({ state, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  const dragged = useRef(false);
  const placed = useRef(false); // позиция зафиксирована после первого показа
  const drag = useRef(null);
  const { rect } = state;

  // Позиционируем ТОЛЬКО при первом показе (рядом с кликнутым словом). Дальше —
  // ни новый разбор, ни изменение размера содержимого окно не двигают; двигает
  // только перетаскивание за заголовок.
  useLayoutEffect(() => {
    if (placed.current || dragged.current) return;
    const el = ref.current;
    if (!el) return;
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!rect) {
      setPos({ top: pad, left: Math.max(pad, vw - w - pad) });
    } else {
      const left = Math.min(Math.max(pad, rect.left), vw - w - pad);
      let top = rect.bottom + pad;
      if (top + h > vh - pad) {
        const above = rect.top - h - pad;
        top = above >= pad ? above : Math.max(pad, vh - h - pad);
      }
      setPos({ top, left });
    }
    if (!state.loading) placed.current = true; // фиксируем после загрузки контента
  }, [rect, state.items, state.loading, state.error]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Перетаскивание за заголовок.
  function onHandleDown(e) {
    if (e.button !== 0) return;
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.preventDefault();
    const onMove = (ev) => {
      dragged.current = true;
      const pad = 4;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const left = Math.min(Math.max(pad, ev.clientX - drag.current.dx), window.innerWidth - w - pad);
      const top = Math.min(Math.max(pad, ev.clientY - drag.current.dy), window.innerHeight - h - pad);
      setPos({ top, left });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        visibility: pos ? "visible" : "hidden",
      }}
      className={cn(
        "fixed z-50 flex max-h-[85vh] w-96 max-w-[calc(100vw-1rem)] flex-col",
        "rounded-2xl border bg-popover text-popover-foreground shadow-2xl"
      )}
    >
      {/* Заголовок — ручка для перетаскивания */}
      <div
        onMouseDown={onHandleDown}
        className="flex cursor-move touch-none select-none items-center justify-between gap-2 rounded-t-2xl border-b bg-muted/40 px-4 py-2.5"
      >
        <span className="flex items-center gap-2">
          <GripHorizontal className="size-4 text-muted-foreground" />
          <span className="font-jp text-2xl">{state.text}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">разбор</span>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </span>
      </div>

      {/* Содержимое */}
      <div className="overflow-y-auto p-5">
        {state.loading ? (
          <div className="flex items-center gap-2 py-2 text-lg text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> загрузка…
          </div>
        ) : state.error ? (
          <p className="text-lg text-red-500">{state.error}</p>
        ) : state.items?.length ? (
          <div className="flex flex-col gap-5">
            {state.items.map((k, i) => (
              <KanjiCard key={i} k={k} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">в этом слове нет кандзи</p>
        )}
      </div>
    </div>,
    document.body
  );
}
