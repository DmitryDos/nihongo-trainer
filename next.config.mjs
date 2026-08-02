import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Мобильная/статическая сборка (scripts/build-mobile.mjs выставляет NEXT_OUTPUT=export):
// статический экспорт в ./out, без оптимизатора картинок и без серверных фич.
const isExport = process.env.NEXT_OUTPUT === "export";

// GitHub Pages отдаёт проект по под-пути /<repo>/ — CI выставляет NEXT_PUBLIC_BASE_PATH
// (тот же флаг читает local-db.js для sql-wasm.wasm). Для Capacitor/локальной статики
// флаг не задан → basePath пустой (корень), нативный апп не ломается.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Явно фиксируем корень проекта (в домашней папке есть ещё один pnpm-lock.yaml).
  turbopack: {
    root: __dirname,
  },
  ...(isExport
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
};

export default nextConfig;
