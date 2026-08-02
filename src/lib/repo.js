// Вся работа с БД в одном месте. Браузеро-безопасно: handle приходит через
// инъекцию (db-context), а не из серверного db.js. Значит один и тот же repo
// работает и на сервере (node:sqlite), и в браузере (sql.js) — без расхождений.
import { db } from "./db-context.js";
import { nextWeight, pickWeighted, NEW_WORD_WEIGHT } from "./weights.js";
import { analyzeText } from "./analyze.js";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function listWords({ pos, topic, search } = {}) {
  const cond = [];
  const params = [];
  if (pos && pos !== "all") {
    cond.push("pos = ?");
    params.push(pos);
  }
  if (topic && topic !== "all") {
    cond.push("topic = ?");
    params.push(topic);
  }
  let sql = "SELECT * FROM words";
  if (cond.length) sql += " WHERE " + cond.join(" AND ");
  sql += " ORDER BY id DESC";
  const rows = db.prepare(sql).all(...params);
  // Поиск фильтруем в JS: SQLite LIKE/LOWER не сворачивают регистр кириллицы, из-за
  // чего запрос с заглавной буквы (автозаглавная на телефоне) не находил слово.
  const q = (search || "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((w) =>
    [w.kanji, w.kana, w.russian].some((f) => (f || "").toLowerCase().includes(q))
  );
}

export function getWord(id) {
  return db.prepare("SELECT * FROM words WHERE id = ?").get(Number(id));
}

export function addWord(w) {
  const now = Date.now();
  const res = db
    .prepare(
      `INSERT INTO words (kanji, kana, russian, pos, topic, weight, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      (w.kanji ?? "").trim(),
      (w.kana ?? "").trim(),
      (w.russian ?? "").trim(),
      w.pos ?? "other",
      (w.topic ?? "").trim(),
      Number.isFinite(w.weight) ? w.weight : NEW_WORD_WEIGHT,
      now
    );
  return getWord(Number(res.lastInsertRowid));
}

export function updateWord(id, fields) {
  const allowed = ["kanji", "kana", "russian", "pos", "topic", "weight"];
  const sets = [];
  const params = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      params.push(key === "weight" ? Number(fields[key]) : String(fields[key]));
    }
  }
  if (!sets.length) return getWord(id);
  params.push(Number(id));
  db.prepare(`UPDATE words SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  return getWord(id);
}

export function deleteWord(id) {
  db.prepare("DELETE FROM attempts WHERE word_id = ?").run(Number(id));
  db.prepare("DELETE FROM words WHERE id = ?").run(Number(id));
  return { ok: true };
}

// Записать результат ответа: обновить вес/статистику слова и добавить запись в attempts.
export function recordAttempt({ wordId, correct, mode = "flashcard", direction = null }) {
  const word = getWord(wordId);
  if (!word) return null;
  const isCorrect = !!correct;
  const c = isCorrect ? 1 : 0;
  const newWeight = nextWeight(word.weight, isCorrect);
  const now = Date.now();
  db.prepare(
    `UPDATE words
       SET weight = ?, correct = correct + ?, wrong = wrong + ?, streak = ?, last_seen = ?
     WHERE id = ?`
  ).run(newWeight, c, isCorrect ? 0 : 1, isCorrect ? word.streak + 1 : 0, now, wordId);
  db.prepare(
    `INSERT INTO attempts (word_id, mode, direction, correct, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(wordId, mode, direction, c, now);
  return getWord(wordId);
}

export function recordAttemptsBatch(results, { mode = "story", direction = null } = {}) {
  const updated = [];
  for (const r of results || []) {
    const res = recordAttempt({ wordId: r.wordId, correct: r.correct, mode, direction });
    if (res) updated.push(res);
  }
  return updated;
}

// Выбрать следующее слово по весам с учётом фильтров/пресета.
export function pickNext({ pos, topic, excludeId, presetId } = {}) {
  const words = presetId ? presetWords(presetId) : listWords({ pos, topic });
  return pickWeighted(words, { excludeId: excludeId != null ? Number(excludeId) : undefined });
}

export function listTopics() {
  return db
    .prepare("SELECT DISTINCT topic FROM words WHERE topic <> '' ORDER BY topic")
    .all()
    .map((r) => r.topic);
}

export function getStats() {
  const totals = db
    .prepare(
      "SELECT COUNT(*) AS words, COALESCE(SUM(correct),0) AS correct, COALESCE(SUM(wrong),0) AS wrong FROM words"
    )
    .get();
  const all = db
    .prepare("SELECT COUNT(*) AS total, COALESCE(SUM(correct),0) AS correct FROM attempts")
    .get();
  const today = db
    .prepare(
      "SELECT COUNT(*) AS total, COALESCE(SUM(correct),0) AS correct FROM attempts WHERE created_at >= ?"
    )
    .get(startOfToday());
  const weakest = db
    .prepare(
      "SELECT id, kanji, kana, russian, pos, weight, correct, wrong FROM words ORDER BY weight DESC, wrong DESC LIMIT 5"
    )
    .all();
  const byPos = db
    .prepare("SELECT pos, COUNT(*) AS n FROM words GROUP BY pos")
    .all();
  const accuracy = all.total ? all.correct / all.total : 0;
  return { totals, attempts: all, today, weakest, byPos, accuracy };
}

// --- Тексты (заготовки и сгенерированные) ---
export function listTexts(kind) {
  if (kind) {
    return db
      .prepare("SELECT * FROM texts WHERE kind = ? ORDER BY id DESC")
      .all(kind);
  }
  return db.prepare("SELECT * FROM texts ORDER BY id DESC").all();
}

export function getText(id) {
  return db.prepare("SELECT * FROM texts WHERE id = ?").get(Number(id));
}

export function addText(t) {
  const now = Date.now();
  const res = db
    .prepare(
      `INSERT INTO texts (kind, level, title, japanese, russian, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      t.kind || "text",
      t.level || "N5",
      (t.title || "").trim(),
      (t.japanese || "").trim(),
      (t.russian || "").trim(),
      t.source || "generated",
      now
    );
  return getText(Number(res.lastInsertRowid));
}

export function deleteText(id) {
  db.prepare("DELETE FROM texts WHERE id = ?").run(Number(id));
  return { ok: true };
}

export function getSetting(key, def = null) {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row ? row.value : def;
}

export function setSetting(key, value) {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, String(value));
  return { key, value: String(value) };
}

// --- Пресеты (подмножества слов) ---
function safeIds(json) {
  try {
    const a = JSON.parse(json);
    return Array.isArray(a) ? a.map(Number) : [];
  } catch {
    return [];
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function listPresets() {
  return db
    .prepare("SELECT id, name, word_ids, created_at FROM presets ORDER BY id DESC")
    .all()
    .map((p) => ({ id: p.id, name: p.name, created_at: p.created_at, count: safeIds(p.word_ids).length }));
}

export function getPreset(id) {
  return db.prepare("SELECT * FROM presets WHERE id = ?").get(Number(id));
}

// Пресет с распарсенными id слов (для клиента/модалки).
export function getPresetOut(id) {
  const p = getPreset(id);
  if (!p) return null;
  const wordIds = safeIds(p.word_ids);
  return { id: p.id, name: p.name, created_at: p.created_at, wordIds, count: wordIds.length };
}

export function updatePreset(id, { name, wordIds } = {}) {
  const sets = [];
  const params = [];
  if (name !== undefined) {
    sets.push("name = ?");
    params.push(String(name));
  }
  if (wordIds !== undefined) {
    sets.push("word_ids = ?");
    params.push(JSON.stringify((wordIds || []).map(Number)));
  }
  if (sets.length) {
    params.push(Number(id));
    db.prepare(`UPDATE presets SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  }
  return getPresetOut(id);
}

// Слова пресета (в порядке словаря, для рандома по весам).
export function presetWords(id) {
  const p = getPreset(id);
  if (!p) return [];
  const ids = new Set(safeIds(p.word_ids));
  return listWords().filter((w) => ids.has(w.id));
}

export function createPreset({ name, wordIds }) {
  const now = Date.now();
  const res = db
    .prepare("INSERT INTO presets (name, word_ids, created_at) VALUES (?, ?, ?)")
    .run(String(name || "Пресет"), JSON.stringify((wordIds || []).map(Number)), now);
  return getPresetOut(Number(res.lastInsertRowid));
}

export function deletePreset(id) {
  db.prepare("DELETE FROM presets WHERE id = ?").run(Number(id));
  return { ok: true };
}

// Случайные N слов заданной части речи (или все).
export function samplePosWordIds(pos, count = 20) {
  const words = listWords(pos && pos !== "all" ? { pos } : {});
  return shuffle(words).slice(0, count).map((w) => w.id);
}

// N «самых ошибочных»: больше всего ошибок, затем выше вес (чаще путаются).
export function weakestWordIds(count = 20) {
  return db
    .prepare("SELECT id FROM words ORDER BY wrong DESC, weight DESC, correct ASC LIMIT ?")
    .all(count)
    .map((r) => r.id);
}

// --- Сопоставление (разрезанные предложения) ---
// Режем предложение на две половины у границы, ближайшей к середине:
// сначала по пробелу (в заготовках фразы разделены пробелами), иначе по границе
// слова (токенайзер по базе), иначе просто по середине.
function splitSentence(jp, words) {
  const s = String(jp || "").trim();
  if (s.length < 4) return null;
  const mid = s.length / 2;
  const nearest = (arr) => arr.reduce((b, i) => (Math.abs(i - mid) < Math.abs(b - mid) ? i : b), arr[0]);

  const spaces = [];
  for (let i = 1; i < s.length - 1; i++) if (s[i] === " " || s[i] === "　") spaces.push(i);
  if (spaces.length) {
    const cut = nearest(spaces);
    return [s.slice(0, cut).trim(), s.slice(cut + 1).trim()];
  }

  const segs = analyzeText(s, words);
  const bounds = [];
  let pos = 0;
  for (const seg of segs) {
    pos += seg.text.length;
    if (pos > 1 && pos < s.length - 1) bounds.push(pos);
  }
  const cut = bounds.length ? nearest(bounds) : Math.round(mid);
  return [s.slice(0, cut).trim(), s.slice(cut).trim()];
}

// Набор из count предложений для сопоставления; при пресете — только те, что
// содержат слова пресета (если таких хватает).
export function matchingSet({ presetId, count = 5 } = {}) {
  const words = listWords();
  let sentences = listTexts("sentence");

  if (presetId) {
    const pw = presetWords(presetId);
    if (pw.length) {
      const has = (jp) =>
        pw.some((w) => {
          const k = (w.kanji || "").trim();
          const kn = (w.kana || "").trim();
          return (k && jp.includes(k)) || (kn && kn.length >= 2 && jp.includes(kn));
        });
      const filtered = sentences.filter((s) => has(s.japanese));
      if (filtered.length >= 3) sentences = filtered;
    }
  }

  return shuffle(sentences)
    .slice(0, count)
    .map((s) => {
      const parts = splitSentence(s.japanese, words);
      return parts ? { id: s.id, left: parts[0], right: parts[1], russian: s.russian } : null;
    })
    .filter((x) => x && x.left && x.right);
}

// Данные о словах для «level up» — компактно, чтобы отдать модели.
export function wordsForReview() {
  return db
    .prepare(
      `SELECT id, kanji, kana, russian, pos, topic, weight, correct, wrong, streak
       FROM words ORDER BY id`
    )
    .all()
    .map((w) => ({
      ...w,
      accuracy: w.correct + w.wrong ? +(w.correct / (w.correct + w.wrong)).toFixed(2) : null,
    }));
}
