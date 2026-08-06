// Схема БД и сидинг — общий код для обоих драйверов:
//   сервер  — node:sqlite (db.js),
//   мобилка/статик — sql.js в браузере (local-db.js).
// Использует только db.exec / db.prepare(...).all/.get/.run — без платформенных
// зависимостей, поэтому импортируется и на клиенте.
import { SEED_WORDS } from "./seed-data.js";
import { SEED_TEXTS } from "./seed-texts.js";
import { SEED_PHRASES } from "./seed-phrases.js";

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS words (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kanji      TEXT    NOT NULL DEFAULT '',
  kana       TEXT    NOT NULL,
  russian    TEXT    NOT NULL,
  pos        TEXT    NOT NULL DEFAULT 'other',
  topic      TEXT    NOT NULL DEFAULT '',
  weight     REAL    NOT NULL DEFAULT 1.0,
  correct    INTEGER NOT NULL DEFAULT 0,
  wrong      INTEGER NOT NULL DEFAULT 0,
  streak     INTEGER NOT NULL DEFAULT 0,
  last_seen  INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id    INTEGER NOT NULL,
  mode       TEXT    NOT NULL,
  direction  TEXT,
  correct    INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS texts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT    NOT NULL DEFAULT 'text',   -- 'sentence' | 'text'
  level      TEXT    NOT NULL DEFAULT 'N5',
  title      TEXT    NOT NULL DEFAULT '',
  japanese   TEXT    NOT NULL,
  russian    TEXT    NOT NULL,
  source     TEXT    NOT NULL DEFAULT 'preset', -- 'preset' | 'generated'
  created_at INTEGER NOT NULL
);

-- Пресеты: именованные подмножества слов (пул для рандома в карточках/чтении/викторине).
CREATE TABLE IF NOT EXISTS presets (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  word_ids   TEXT    NOT NULL DEFAULT '[]',      -- JSON-массив id слов
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_word ON attempts(word_id);
CREATE INDEX IF NOT EXISTS idx_attempts_time ON attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_texts_kind ON texts(kind);
`;

// Идемпотентный догон слов: добавляем из сида те, которых ещё нет (по кандзи+кане).
// Так новые слова из seed-data подхватываются и в уже существующую базу (телефон/сервер),
// не трогая прогресс по имеющимся. (Удалённые пользователем сид-слова могут вернуться.)
export function seedWords(db) {
  const existing = new Set(
    db.prepare("SELECT kanji, kana FROM words").all().map((r) => `${r.kanji}${r.kana}`)
  );
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO words (kanji, kana, russian, pos, topic, weight, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  for (const w of SEED_WORDS) {
    const key = `${w.kanji ?? ""}${w.kana}`;
    if (existing.has(key)) continue;
    insert.run(
      w.kanji ?? "",
      w.kana,
      w.russian,
      w.pos ?? "other",
      w.topic ?? "",
      w.weight ?? 1.5,
      now
    );
  }
}

// Идемпотентный догон предложений/текстов (по японскому) — как у слов и фраз:
// новые заготовки из сида подхватываются и в уже существующую базу, прогресс цел.
export function seedTexts(db) {
  const existing = new Set(db.prepare("SELECT japanese FROM texts").all().map((r) => r.japanese));
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO texts (kind, level, title, japanese, russian, source, created_at)
     VALUES (?, ?, ?, ?, ?, 'preset', ?)`
  );
  for (const t of SEED_TEXTS) {
    if (existing.has(t.japanese)) continue;
    // У предложений заголовок не показываем (он бы спойлерил перевод); у текстов оставляем.
    const title = t.kind === "sentence" ? "" : t.title ?? "";
    insert.run(t.kind, t.level ?? "N5", title, t.japanese, t.russian, now);
  }
}

// Короткие словосочетания-предложения — идемпотентно (по японскому тексту),
// чтобы новые фразы подхватывались и в уже существующей базе.
export function seedPhrases(db) {
  const existing = new Set(db.prepare("SELECT japanese FROM texts").all().map((r) => r.japanese));
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO texts (kind, level, title, japanese, russian, source, created_at)
     VALUES ('sentence', 'N5', ?, ?, ?, 'preset', ?)`
  );
  for (const p of SEED_PHRASES) {
    if (existing.has(p.japanese)) continue;
    insert.run("", p.japanese, p.russian, now); // без заголовка — он бы спойлерил перевод
  }
}

// Заготовленный пресет «widget»: пустой, создаётся один раз. Пользователь наполняет
// его в приложении, а домашний виджет читает слова строго из него.
export function seedWidgetPreset(db) {
  const exists = db.prepare("SELECT id FROM presets WHERE name = ?").get("widget");
  if (exists) return;
  db.prepare("INSERT INTO presets (name, word_ids, created_at) VALUES ('widget', '[]', ?)").run(
    Date.now()
  );
}

// Разовые правки уже существующей базы — без сброса прогресса. Запускается один
// раз на базу (флаг в settings), чтобы удаления не срабатывали повторно, если
// пользователь потом сам добавит слово с таким же написанием.
//   v1: убрать приписку «(な)» из переводов и удалить исключённые из сида слова.
const REMOVED_WORDS = [
  ["懐かしい", "なつかしい"],
  ["恐ろしい", "おそろしい"],
  ["", "もったいない"],
  ["", "だるい"],
  ["", "ずるい"],
  ["", "うらやましい"],
  ["", "くだらない"],
  ["貧しい", "まずしい"],
  ["眩しい", "まぶしい"],
  ["", "かゆい"],
  ["親しい", "したしい"],
  ["", "おとなしい"],
  ["臭い", "くさい"],
  ["偉い", "えらい"],
  ["当然", "とうぜん"],
  ["素直", "すなお"],
  ["適当", "てきとう"],
  ["確実", "かくじつ"],
  ["上品", "じょうひん"],
  ["下品", "げひん"],
  ["得", "とく"],
  ["制服", "せいふく"],
  ["畑", "はたけ"],
];

export function migrateWords(db) {
  const cur = Number(db.prepare("SELECT value FROM settings WHERE key = 'mig_words'").get()?.value || 0);
  if (cur >= 1) return;

  // 1) снять хвост «(な)» у прилагательных (перевод стал чище в seed-data)
  db.prepare("UPDATE words SET russian = REPLACE(russian, ' (な)', '') WHERE russian LIKE '% (な)%'").run();
  db.prepare("UPDATE words SET russian = REPLACE(russian, '(な)', '') WHERE russian LIKE '%(な)%'").run();

  // 2) удалить исключённые слова вместе с их попытками (прогресс по остальным цел)
  const findId = db.prepare("SELECT id FROM words WHERE kanji = ? AND kana = ?");
  const delAttempts = db.prepare("DELETE FROM attempts WHERE word_id = ?");
  const delWord = db.prepare("DELETE FROM words WHERE id = ?");
  for (const [kanji, kana] of REMOVED_WORDS) {
    const row = findId.get(kanji, kana);
    if (!row) continue;
    delAttempts.run(row.id);
    delWord.run(row.id);
  }

  db.prepare(
    "INSERT INTO settings (key, value) VALUES ('mig_words', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run();
}

// Разовое удаление 10 старых пресет-текстов, заменённых новым набором из 20
// (флаг mig_texts). Трогаем только preset-тексты прежнего сида — пользовательские
// и сгенерированные (source != 'preset') остаются на месте.
const REMOVED_TEXTS = [
  "私は毎朝六時に起きます。顔を洗って、朝ご飯を食べます。それからコーヒーを飲んで、新聞を読みます。七時半に家を出ます。",
  "私は電車で学校に行きます。駅まで歩いて、電車に乗ります。学校は町の中にあります。友達と一緒に日本語を勉強します。",
  "今日はスーパーへ買い物に行きました。野菜と魚と水を買いました。少し高かったですが、新しくておいしそうでした。",
  "私は猫を飼っています。名前はタマです。タマは小さくて白いです。よく寝て、時々遊びます。私はタマが大好きです。",
  "週末は友達と公園へ行きました。天気が良くて、暖かかったです。私たちは歩いて、写真を撮りました。とても楽しかったです。",
  "私は毎日日本語を勉強します。新しい言葉を覚えるのは難しいですが、面白いです。分からない時は、先生に聞きます。",
  "今日は朝から雨が降っています。私は傘を持って出かけました。電車は少し遅れましたが、仕事に間に合いました。",
  "昨日、家族とレストランで晩ご飯を食べました。私は魚を注文しました。とてもおいしかったです。店の人は親切でした。",
  "先月から新しい仕事を始めました。毎日忙しいですが、同僚は優しいです。少しずつ仕事を覚えています。もっと頑張りたいです。",
  "来月、友達と京都へ旅行に行きます。古いお寺を見たり、有名な料理を食べたりしたいです。今、いいホテルを探しています。",
];

export function migrateTexts(db) {
  const cur = Number(db.prepare("SELECT value FROM settings WHERE key = 'mig_texts'").get()?.value || 0);
  if (cur >= 1) return;
  const del = db.prepare("DELETE FROM texts WHERE japanese = ? AND source = 'preset'");
  for (const jp of REMOVED_TEXTS) del.run(jp);
  db.prepare(
    "INSERT INTO settings (key, value) VALUES ('mig_texts', '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run();
}

// Полная инициализация: схема + сид (в порядке, как на сервере).
export function initSchemaAndSeed(db) {
  db.exec(SCHEMA);
  seedWords(db);
  migrateWords(db);
  seedTexts(db);
  migrateTexts(db);
  seedPhrases(db);
  seedWidgetPreset(db);
}
