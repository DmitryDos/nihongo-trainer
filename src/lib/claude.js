// Вызовы Claude через локальный Claude Code CLI (использует твою Max-подписку —
// отдельный платный API-ключ не нужен). Если задан ANTHROPIC_API_KEY, используется он.
import { execFile, execFileSync } from "node:child_process";

const MODEL = process.env.CLAUDE_MODEL || "sonnet";

// Кэшируем проверку наличия CLI между запросами.
const g = globalThis;
export function claudeAvailable() {
  if (g.__claudeAvailable !== undefined) return g.__claudeAvailable;
  try {
    execFileSync("claude", ["--version"], { timeout: 10000, stdio: "ignore" });
    g.__claudeAvailable = true;
  } catch {
    g.__claudeAvailable = false;
  }
  return g.__claudeAvailable;
}

export function generationMethod() {
  if (process.env.ANTHROPIC_API_KEY) return "apikey";
  if (claudeAvailable()) return "subscription";
  return "none";
}

function extractJson(text) {
  const s = String(text || "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Модель вернула не-JSON ответ");
  return JSON.parse(s.slice(start, end + 1));
}

// Один прогон Claude Code в print-режиме, возвращает распарсенный JSON.
function runClaudeCli(prompt) {
  return new Promise((resolve, reject) => {
    execFile(
      "claude",
      ["-p", prompt, "--model", MODEL, "--output-format", "json"],
      { timeout: 180000, maxBuffer: 20 * 1024 * 1024 },
      (err, stdout) => {
        if (err) {
          if (err.code === "ENOENT")
            return reject(new Error("Claude Code CLI не найден. Установи Claude Code и войди (claude)."));
          return reject(new Error("Ошибка Claude CLI: " + (err.message || err)));
        }
        try {
          const env = JSON.parse(stdout);
          if (env.is_error) return reject(new Error("Claude вернул ошибку: " + (env.result || env.subtype)));
          resolve(extractJson(env.result));
        } catch (e) {
          reject(new Error("Не удалось разобрать ответ Claude: " + e.message));
        }
      }
    );
  });
}

// Через официальный SDK, если есть API-ключ (structured output — просим JSON и парсим).
async function runApiKey(prompt) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });
  const text = (msg.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
  return extractJson(text);
}

async function ask(prompt) {
  if (process.env.ANTHROPIC_API_KEY) return runApiKey(prompt);
  return runClaudeCli(prompt);
}

// Генерация предложений / текста.
export async function generateText({ kind = "text", level = "N5", words = [] }) {
  const shape =
    kind === "sentence"
      ? "3–5 отдельных простых предложений (не связанных в сюжет)"
      : "короткий связный текст из 4–7 предложений";
  const vocab = words
    .map((w) => `- ${w.kanji || w.kana}（${w.kana}）— ${w.russian}`)
    .join("\n");

  const prompt = `Ты — преподаватель японского для русскоязычного ученика.
Составь ${shape} на японском уровня JLPT ${level}. Японский должен быть естественным.
Постарайся задействовать как можно больше слов из моего словаря (форму можно менять):
${vocab || "(словарь пуст — используй базовую лексику уровня)"}

Верни СТРОГО валидный JSON без markdown, ровно такой структуры:
{"title": "<короткий заголовок на русском>", "japanese": "<японский текст>", "russian": "<точный перевод на русский>"}
Только JSON, без пояснений.`;

  const out = await ask(prompt);
  return {
    title: String(out.title || "Без названия"),
    japanese: String(out.japanese || "").trim(),
    russian: String(out.russian || "").trim(),
    level,
    kind,
  };
}

// «Level up»: пересмотр весов + новые слова.
export async function reviewProgress({ words = [] }) {
  const table = words
    .map(
      (w) =>
        `id=${w.id} | ${w.kanji || w.kana}(${w.kana})=${w.russian} | pos=${w.pos} | вес=${Number(
          w.weight
        ).toFixed(2)} | верно=${w.correct} неверно=${w.wrong} серия=${w.streak} точность=${
          w.accuracy == null ? "—" : w.accuracy
        }`
    )
    .join("\n");

  const prompt = `Ты — движок интервального повторения для японского. Вот словарь и статистика:
${table}

Правила:
- Лёгкие слова (высокая точность и серия >= 3) — понизь вес (0.15–0.5).
- Слова с ошибками — оставь высокий или подними (3–8).
- Предложи 3–6 новых слов, расширяющих темы/уровень, без повторов существующих.

Верни СТРОГО валидный JSON без markdown:
{"note": "<резюме на русском>", "adjustments": [{"id": <int>, "weight": <число 0.15–8>}], "newWords": [{"kanji": "<или пусто>", "kana": "<чтение>", "russian": "<перевод>", "pos": "verb|adjective|noun|adverb|expression|other"}]}
Только JSON.`;

  const out = await ask(prompt);
  return {
    note: String(out.note || ""),
    adjustments: Array.isArray(out.adjustments) ? out.adjustments : [],
    newWords: Array.isArray(out.newWords) ? out.newWords : [],
  };
}
