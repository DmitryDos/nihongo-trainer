// Серверный драйвер БД: SQLite через встроенный в Node 24 модуль node:sqlite
// (без нативных зависимостей). Файл ./data/nihongo.db (в .gitignore).
// Схема и сид — общие с клиентом (schema.js). handle регистрируется для repo.js
// через db-context. Импортируется только серверным кодом (repo-server.js / роуты).
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { initSchemaAndSeed } from "./schema.js";
import { setDb } from "./db-context.js";

const DB_PATH =
  process.env.NIHONGO_DB_PATH || path.join(process.cwd(), "data", "nihongo.db");

function createDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  initSchemaAndSeed(db);
  return db;
}

// Синглтон, переживающий hot-reload в dev (иначе на каждый HMR открывалась бы новая БД).
const g = globalThis;
export const db = g.__nihongoDb ?? (g.__nihongoDb = createDb());

// Регистрируем серверный handle: repo.js читает БД через db-context.
setDb(db);
