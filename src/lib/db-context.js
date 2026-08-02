// Инъекция активного handle БД. repo.js работает поверх любого драйвера с
// интерфейсом node:sqlite (prepare(sql).all/.get/.run + exec):
//   сервер — node:sqlite (db.js регистрирует handle через setDb);
//   мобилка/статик — адаптер поверх sql.js (local-db.js).
// Модуль браузеро-безопасный: сам никаких платформенных зависимостей не тянет.
let _db = null;

export function setDb(handle) {
  _db = handle;
}

export function getDb() {
  if (!_db) throw new Error("БД не инициализирована: сначала вызови setDb(handle).");
  return _db;
}

// Прокси, чтобы repo.js мог по-прежнему писать `db.prepare(...)` без изменений.
export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const handle = getDb();
      const value = handle[prop];
      return typeof value === "function" ? value.bind(handle) : value;
    },
  }
);
