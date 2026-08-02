// Сборка статической (офлайн) версии для Capacitor/GitHub Pages.
// API-роуты несовместимы с output:export (force-dynamic, чтение запроса), поэтому
// на время сборки прячем src/app/api за пределы дерева app, затем возвращаем.
// Результат — статика в ./out (data-layer работает локально: sql.js + IndexedDB).
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const apiStash = path.join(root, ".api-disabled");

// Синхронизировать вшитый список слов виджета с сидом перед сборкой.
execSync("node scripts/gen-widget-words.mjs", { stdio: "inherit" });

function move(from, to) {
  if (fs.existsSync(from)) fs.renameSync(from, to);
}

// На случай прерванной прошлой сборки — сперва восстановим, если заначка осталась.
move(apiStash, apiDir);

move(apiDir, apiStash);
try {
  execSync("pnpm exec next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_OUTPUT: "export", NEXT_PUBLIC_DATA: "local" },
  });
} finally {
  move(apiStash, apiDir);
}

console.log("\n✓ Статическая сборка готова: ./out");
