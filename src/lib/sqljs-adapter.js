// Адаптер поверх sql.js Database под интерфейс node:sqlite, который использует
// repo.js: db.exec(sql) и db.prepare(sql).all/.get/.run(...params), плюс
// res.lastInsertRowid / res.changes у .run(). Чистый модуль (без импортов) —
// его можно тестировать и в Node с node-сборкой sql.js.
export function makeAdapter(sqlDb, onMutate = () => {}) {
  const bind = (stmt, params) => {
    if (params && params.length) stmt.bind(params);
  };
  return {
    exec(sql) {
      sqlDb.exec(sql);
    },
    prepare(sql) {
      return {
        all(...params) {
          const stmt = sqlDb.prepare(sql);
          try {
            bind(stmt, params);
            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            return rows;
          } finally {
            stmt.free();
          }
        },
        get(...params) {
          const stmt = sqlDb.prepare(sql);
          try {
            bind(stmt, params);
            return stmt.step() ? stmt.getAsObject() : undefined;
          } finally {
            stmt.free();
          }
        },
        run(...params) {
          sqlDb.run(sql, params && params.length ? params : undefined);
          const res = sqlDb.exec("SELECT last_insert_rowid() AS id, changes() AS n");
          const row = res[0]?.values?.[0] ?? [0, 0];
          onMutate();
          return { lastInsertRowid: row[0], changes: row[1] };
        },
      };
    },
  };
}
