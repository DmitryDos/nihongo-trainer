// Клиент данных для компонентов. Два режима, выбор на этапе сборки:
//   • серверная сборка — ходит в /api/* (fetch);
//   • мобильная/статическая (NEXT_PUBLIC_DATA=local) — считает всё локально в
//     браузере через тот же repo.js поверх sql.js (local-db) + IndexedDB.
// Публичный интерфейс `api` одинаков в обоих режимах — компоненты не меняются.

const LOCAL = process.env.NEXT_PUBLIC_DATA === "local";

/* ============================ Сетевой бэкенд ============================ */

async function req(url, opts) {
  const res = await fetch(url, opts);
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* пустой ответ */
  }
  if (!res.ok) throw new Error(data.error || `Ошибка запроса (${res.status})`);
  return data;
}

function jsonBody(method, body) {
  return {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

const fetchApi = {
  words: (params = {}) => req(`/api/words?${new URLSearchParams(params)}`),
  addWord: (w) => req("/api/words", jsonBody("POST", w)),
  updateWord: (w) => req("/api/words", jsonBody("PATCH", w)),
  deleteWord: (id) => req(`/api/words?id=${id}`, { method: "DELETE" }),

  next: (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== "")
    );
    return req(`/api/next?${new URLSearchParams(clean)}`);
  },
  attempt: (body) => req("/api/attempt", jsonBody("POST", body)),

  stats: () => req("/api/stats"),

  texts: (kind) => req(`/api/texts${kind ? `?kind=${kind}` : ""}`),
  deleteText: (id) => req(`/api/texts?id=${id}`, { method: "DELETE" }),

  settings: () => req("/api/settings"),
  setSetting: (key, value) => req("/api/settings", jsonBody("POST", { key, value })),

  generate: (body) => req("/api/generate", jsonBody("POST", body)),
  levelup: () => req("/api/levelup", { method: "POST" }),

  kanji: (chars) => req(`/api/kanji?chars=${encodeURIComponent(chars)}`),
  kanjiList: () => req("/api/kanji"),

  matching: (presetId) => req(`/api/matching?presetId=${encodeURIComponent(presetId || "")}`),

  presets: () => req("/api/presets"),
  preset: (id) => req(`/api/presets?id=${id}`),
  createPreset: (body) => req("/api/presets", jsonBody("POST", body)),
  updatePreset: (body) => req("/api/presets", jsonBody("PATCH", body)),
  deletePreset: (id) => req(`/api/presets?id=${id}`, { method: "DELETE" }),
};

/* ============================ Локальный бэкенд ============================ */
// Ленивая инициализация: WASM и repo подгружаются только в браузере при первом
// обращении (в серверной сборке этот код не исполняется).

let _repo = null;
async function repo() {
  if (!_repo) {
    const local = await import("./local-db.js");
    await local.initLocalDb();
    _repo = await import("./repo.js");
  }
  return _repo;
}

const offline = () => {
  throw new Error("Функция недоступна в офлайн-версии");
};

const localApi = {
  words: async (params = {}) => {
    const r = await repo();
    return {
      words: r.listWords({
        pos: params.pos || undefined,
        topic: params.topic || undefined,
        search: params.search || undefined,
      }),
    };
  },
  addWord: async (w) => {
    if (!w?.kana || !w?.russian) throw new Error("Нужны как минимум чтение (кана) и перевод");
    const r = await repo();
    return { word: r.addWord(w) };
  },
  updateWord: async (w) => {
    if (!w?.id) throw new Error("Нужен id");
    const r = await repo();
    return { word: r.updateWord(w.id, w) };
  },
  deleteWord: async (id) => {
    const r = await repo();
    r.deleteWord(id);
    return { ok: true };
  },

  next: async (params = {}) => {
    const r = await repo();
    const word = r.pickNext({
      pos: params.pos || undefined,
      topic: params.topic || undefined,
      excludeId: params.excludeId || undefined,
      presetId: params.presetId || undefined,
    });
    if (!word) return { word: null, error: "Нет слов под выбранный фильтр" };
    return { word };
  },
  attempt: async (body) => {
    const r = await repo();
    if (Array.isArray(body.results)) {
      return {
        updated: r.recordAttemptsBatch(body.results, {
          mode: body.mode,
          direction: body.direction,
        }),
      };
    }
    if (!body.wordId) throw new Error("Нужен wordId");
    return { word: r.recordAttempt(body) };
  },

  stats: async () => {
    const r = await repo();
    return r.getStats();
  },

  texts: async (kind) => {
    const r = await repo();
    return { texts: r.listTexts(kind || undefined) };
  },
  deleteText: async (id) => {
    const r = await repo();
    r.deleteText(id);
    return { ok: true };
  },

  settings: async () => {
    const r = await repo();
    return {
      canGenerate: false, // без сервера/ключа генерации нет
      method: "none",
      level: r.getSetting("level", "N5"),
      font: r.getSetting("font", "noto"),
    };
  },
  setSetting: async (key, value) => {
    if (!key) throw new Error("Нужен key");
    const r = await repo();
    return { setting: r.setSetting(key, value) };
  },

  // Генерация текста и «level up» требуют Claude/сервер — в офлайне недоступны.
  generate: offline,
  levelup: offline,

  kanji: async (chars) => {
    const { breakdownWord } = await import("./kanji-info.js");
    return { items: breakdownWord(chars) };
  },
  kanjiList: async () => {
    const r = await repo();
    const { breakdownKanji } = await import("./kanji-info.js");
    const { extractKanji } = await import("./kanji.js");
    const seen = new Set();
    const kanji = [];
    for (const w of r.listWords()) {
      for (const ch of extractKanji(w.kanji || "")) {
        if (!seen.has(ch)) {
          seen.add(ch);
          kanji.push(ch);
        }
      }
    }
    const items = kanji
      .map(breakdownKanji)
      .sort((a, b) => (a.strokes || 99) - (b.strokes || 99) || a.char.localeCompare(b.char));
    return { items };
  },

  matching: async (presetId) => {
    const r = await repo();
    return { items: r.matchingSet({ presetId: presetId || undefined, count: 5 }) };
  },

  presets: async () => {
    const r = await repo();
    return { presets: r.listPresets() };
  },
  preset: async (id) => {
    const r = await repo();
    return { preset: r.getPresetOut(id) };
  },
  createPreset: async (body) => {
    const r = await repo();
    return { preset: await createPresetLocal(r, body) };
  },
  updatePreset: async (body) => {
    if (!body?.id) throw new Error("Нужен id");
    const r = await repo();
    return { preset: r.updatePreset(body.id, { name: body.name, wordIds: body.wordIds }) };
  },
  deletePreset: async (id) => {
    const r = await repo();
    r.deletePreset(id);
    return { ok: true };
  },
};

// Логика создания пресета (повторяет POST /api/presets: режимы empty/weakest/pos/список).
async function createPresetLocal(r, body) {
  const { POS_OPTIONS } = await import("./seed-data.js");
  const posLabel = Object.fromEntries(POS_OPTIONS.map((p) => [p.value, p.label]));
  const count = Math.max(1, Math.min(500, Number(body.count) || 20));
  let name = body.name;
  let wordIds;

  if (body.mode === "empty") {
    return r.createPreset({ name: name || "Новый пресет", wordIds: [] });
  }
  if (body.mode === "weakest") {
    wordIds = r.weakestWordIds(count);
    name = name || "Ошибочные";
  } else if (body.mode === "pos") {
    wordIds = r.samplePosWordIds(body.pos, count);
    name = name || (body.pos && body.pos !== "all" ? posLabel[body.pos] || body.pos : "Случайные");
  } else {
    wordIds = Array.isArray(body.wordIds) ? body.wordIds : [];
    name = name || `Пресет ×${wordIds.length}`;
  }
  if (!wordIds.length) throw new Error("Нет слов для пресета");
  return r.createPreset({ name, wordIds });
}

export const api = LOCAL ? localApi : fetchApi;
