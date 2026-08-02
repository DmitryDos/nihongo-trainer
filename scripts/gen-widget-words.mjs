// Синхронизация вшитого списка слов виджета с сидом приложения.
// Читает SEED_WORDS из src/lib/seed-data.js и переписывает массив
// `static let all: [Word] = [ ... ]` в ios/App/nihongo_trainer/nihongo_trainer.swift.
// Запускается автоматически из build-mobile.mjs (и вручную: node scripts/gen-widget-words.mjs).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const seedPath = path.join(root, "src", "lib", "seed-data.js");
const swiftPath = path.join(root, "ios", "App", "nihongo_trainer", "nihongo_trainer.swift");

if (!fs.existsSync(swiftPath)) {
  console.log("· Виджет не найден (нет ios/App/nihongo_trainer) — пропускаю синхронизацию.");
  process.exit(0);
}

const { SEED_WORDS } = await import(pathToFileURL(seedPath).href);

// Экранирование для строкового литерала Swift.
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const lines = SEED_WORDS.map((w) => {
  const jp = w.kanji && w.kanji.trim() ? w.kanji : w.kana; // jp = кандзи, иначе кана
  return `        Word(jp: "${esc(jp)}", reading: "${esc(w.kana)}", ru: "${esc(w.russian)}", pos: "${esc(w.pos)}"),`;
}).join("\n");

const body = `    static let all: [Word] = [\n${lines}\n    ]`;

let src = fs.readFileSync(swiftPath, "utf8");
const re = /    static let all: \[Word\] = \[[\s\S]*?\n    \]/;
if (!re.test(src)) {
  console.error("✗ Не найден массив `static let all: [Word] = [ … ]` в", swiftPath);
  process.exit(1);
}
const next = src.replace(re, body);
if (next !== src) {
  fs.writeFileSync(swiftPath, next);
  console.log(`✓ Виджет синхронизирован: ${SEED_WORDS.length} слов → ${path.relative(root, swiftPath)}`);
} else {
  console.log(`· Виджет уже актуален (${SEED_WORDS.length} слов).`);
}
