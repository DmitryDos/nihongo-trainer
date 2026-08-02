"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { POS_OPTIONS } from "@/lib/seed-data";
import { applyFont } from "@/lib/fonts";
import { PracticeMode } from "@/components/practice-mode";
import { TextMode } from "@/components/text-mode";
import { WordManager } from "@/components/word-manager";
import { KanjiTab } from "@/components/kanji-tab";
import { QuizMode } from "@/components/quiz-mode";
import { PresetBar } from "@/components/preset-bar";
import { SettingsDialog } from "@/components/settings-dialog";
import { NativeSelect } from "@/components/native-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Layers, PencilLine, MessageSquare, BookOpen, ListChecks, Boxes, Shuffle } from "lucide-react";

export function Trainer() {
  const [tab, setTab] = useState("flashcard");
  const [direction, setDirection] = useState("jp2ru");
  const [learnMode, setLearnMode] = useState(false);
  const [presetId, setPresetId] = useState("");
  const [filters, setFilters] = useState({ pos: "all" });
  const [settings, setSettings] = useState(null);

  const refreshStats = useCallback(() => {
    api.stats().catch(() => {});
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const s = await api.settings();
      setSettings(s);
      applyFont(s.font);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function changeFont(value) {
    setSettings((s) => ({ ...s, font: value }));
    applyFont(value);
    api.setSetting("font", value).catch(() => {});
  }

  const wordTab = tab === "flashcard" || tab === "reading" || tab === "quiz";
  const textTab = tab === "sentence" || tab === "text";
  const canGenerate = !!settings?.canGenerate;
  const level = settings?.level || "N5";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Шапка: лого + настройки */}
      <header className="safe-t safe-x shrink-0 pb-2">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-jp text-2xl font-bold tracking-wide">日本語</span>
            <span className="text-sm font-medium text-muted-foreground">тренажёр</span>
          </div>
          <SettingsDialog
            settings={settings}
            onChanged={refreshStats}
            onLevelChange={(l) => setSettings((s) => ({ ...s, level: l }))}
            onFontChange={changeFont}
          />
        </div>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col gap-0">
        {/* Контент — единственная вертикально скроллируемая область */}
        <div className="safe-x min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-1 pb-3">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
            {/* Выбор части речи / пресета для словарных и текстовых режимов */}
            {(wordTab || textTab) && (
              <div className="flex flex-wrap items-center gap-2">
                <NativeSelect
                  value={filters.pos}
                  onChange={(e) => setFilters({ pos: e.target.value })}
                  className="w-44"
                >
                  <option value="all">Все части речи</option>
                  {POS_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </NativeSelect>
                {wordTab && <PresetBar presetId={presetId} onChange={setPresetId} />}
              </div>
            )}

            <TabsContent value="flashcard" className="flex flex-col gap-4">
              <PracticeMode
                mode="flashcard"
                direction={direction}
                onDirectionChange={setDirection}
                learnMode={learnMode}
                onLearnModeChange={setLearnMode}
                filters={filters}
                presetId={presetId}
                onAnswered={refreshStats}
              />
            </TabsContent>

            <TabsContent value="reading">
              <PracticeMode
                mode="reading"
                direction="reading"
                filters={filters}
                presetId={presetId}
                onAnswered={refreshStats}
              />
            </TabsContent>

            <TabsContent value="quiz">
              <QuizMode presetId={presetId} filters={filters} onAnswered={refreshStats} />
            </TabsContent>

            <TabsContent value="sentence">
              <TextMode
                kind="sentence"
                filters={filters}
                level={level}
                canGenerate={canGenerate}
                onAnswered={refreshStats}
                onNeedGen={() => toast.info("Генерация недоступна — проверь вход в Claude Code (см. настройки).")}
              />
            </TabsContent>

            <TabsContent value="text">
              <TextMode
                kind="text"
                filters={filters}
                level={level}
                canGenerate={canGenerate}
                onAnswered={refreshStats}
                onNeedGen={() => toast.info("Генерация недоступна — проверь вход в Claude Code (см. настройки).")}
              />
            </TabsContent>

            <TabsContent value="words">
              <WordManager onChanged={refreshStats} />
            </TabsContent>

            <TabsContent value="kanji">
              <KanjiTab />
            </TabsContent>
          </div>
        </div>

        {/* Футер: режимы в крупной скруглённой серой подложке (по ширине = контент),
            с большим отступом снизу; внутри — ТОЛЬКО горизонтальный скролл
            (touch-action: pan-x, чтобы свайп не проматывал страницу вертикально).
            Мультяшный сегмент-стиль: серая подложка, активный режим — белый блок с тенью. */}
        <div className="safe-x shrink-0 pt-3 pb-[max(2.25rem,env(safe-area-inset-bottom))]">
          <TabsList
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
              touchAction: "pan-x",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
            className="mx-auto w-full max-w-5xl justify-start gap-3 rounded-3xl p-2.5 shadow-sm [&::-webkit-scrollbar]:hidden [&_[data-slot=tabs-trigger]]:h-auto [&_[data-slot=tabs-trigger]]:flex-none [&_[data-slot=tabs-trigger]]:gap-2 [&_[data-slot=tabs-trigger]]:rounded-2xl [&_[data-slot=tabs-trigger]]:px-5 [&_[data-slot=tabs-trigger]]:py-4 [&_[data-slot=tabs-trigger]]:text-lg [&_[data-slot=tabs-trigger]]:font-bold [&_[data-slot=tabs-trigger]]:data-active:shadow-md"
          >
          <TabsTrigger value="flashcard">
            <Layers className="size-5" /> Карточки
          </TabsTrigger>
          <TabsTrigger value="reading">
            <PencilLine className="size-5" /> Чтение
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Shuffle className="size-5" /> Викторина
          </TabsTrigger>
          <TabsTrigger value="sentence">
            <MessageSquare className="size-5" /> Предложения
          </TabsTrigger>
          <TabsTrigger value="text">
            <BookOpen className="size-5" /> Тексты
          </TabsTrigger>
          <TabsTrigger value="words">
            <ListChecks className="size-5" /> Слова
          </TabsTrigger>
          <TabsTrigger value="kanji">
            <Boxes className="size-5" /> Кандзи
          </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
