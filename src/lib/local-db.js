// Клиентский драйвер БД для мобильной/статической сборки: SQLite в WASM (sql.js)
// с интерфейсом node:sqlite, чтобы repo.js работал без изменений.
//
// Персистентность (главное — переживать перезапуск приложения):
//   • НАТИВ (Capacitor) — файл в песочнице приложения (Filesystem, Directory.Data).
//     Живёт между запусками и обновлениями, чистится только при удалении приложения.
//     Надёжнее IndexedDB в WKWebView (она между запусками могла не сохраняться).
//   • ВЕБ/PWA — IndexedDB (+ запрос постоянного хранилища).
//
// Импортируется ТОЛЬКО динамически из api.js в локальном режиме.
import initSqlJs from "sql.js/dist/sql-wasm-browser.js";
import { Capacitor } from "@capacitor/core";
import { initSchemaAndSeed } from "./schema.js";
import { setDb } from "./db-context.js";
import { makeAdapter } from "./sqljs-adapter.js";

const DB_FILE = "nihongo.sqlite";
const IDB_NAME = "nihongo";
const IDB_STORE = "kv";
const IDB_KEY = "sqlite";

// --- base64 <-> Uint8Array (для нативной ФС; чанками, чтобы не упереться в стек) ---
function u8ToBase64(u8) {
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < u8.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK));
  }
  return btoa(s);
}
function base64ToU8(b64) {
  const s = atob(b64);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8;
}

// --- нативный бэкенд: Capacitor Filesystem (файл в песочнице приложения) ---
let fsMod = null;
async function fs() {
  if (!fsMod) fsMod = await import("@capacitor/filesystem");
  return fsMod;
}
async function nativeLoad() {
  const { Filesystem, Directory } = await fs();
  try {
    const { data } = await Filesystem.readFile({ path: DB_FILE, directory: Directory.Data });
    return data ? base64ToU8(String(data)) : null;
  } catch {
    return null; // файла ещё нет
  }
}
async function nativeSave(bytes) {
  const { Filesystem, Directory } = await fs();
  await Filesystem.writeFile({ path: DB_FILE, directory: Directory.Data, data: u8ToBase64(bytes) });
}

// --- веб-бэкенд: IndexedDB ---
function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbLoad() {
  const db = await openIdb();
  try {
    const v = await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const r = tx.objectStore(IDB_STORE).get(IDB_KEY);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => reject(r.error);
    });
    return v ? new Uint8Array(v) : null;
  } finally {
    db.close();
  }
}
async function idbSave(bytes) {
  const db = await openIdb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

let ready = null;

export function initLocalDb() {
  if (ready) return ready;
  ready = (async () => {
    const native = Capacitor.isNativePlatform();
    const loadBytes = native ? nativeLoad : idbLoad;
    const saveBytes = native ? nativeSave : idbSave;

    // Веб: попросить постоянное хранилище, чтобы IndexedDB не вымывалась.
    if (!native && typeof navigator !== "undefined" && navigator.storage?.persist) {
      try {
        await navigator.storage.persist();
      } catch {
        /* ignore */
      }
    }

    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const SQL = await initSqlJs({ locateFile: () => `${base}/sql-wasm.wasm` });

    const saved = await loadBytes().catch(() => null);
    const sqlDb = saved ? new SQL.Database(saved) : new SQL.Database();

    // Сохранение всей базы (дебаунс). Если во время записи пришли новые изменения —
    // перезапишем ещё раз, чтобы не потерять последнее состояние.
    let timer = null;
    let saving = false;
    let dirty = false;
    const flush = async () => {
      if (saving) {
        dirty = true;
        return;
      }
      saving = true;
      try {
        do {
          dirty = false;
          await saveBytes(sqlDb.export());
        } while (dirty);
      } catch (e) {
        console.error("Не удалось сохранить базу:", e);
      } finally {
        saving = false;
      }
    };
    const scheduleSave = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        flush();
      }, 400);
    };

    // Записать при уходе со страницы/сворачивании приложения.
    if (typeof window !== "undefined") {
      const onHide = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        flush();
      };
      window.addEventListener("pagehide", onHide);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") onHide();
      });
    }

    const adapter = makeAdapter(sqlDb, scheduleSave);
    setDb(adapter);

    // Идемпотентно: новая база сеется, существующая догоняет новые слова/фразы.
    initSchemaAndSeed(adapter);
    await flush(); // сразу сохранить (fresh или после догона), чтобы файл точно был на диске
  })();
  return ready;
}
