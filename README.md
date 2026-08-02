# 日本語 тренажёр

Персональный тренажёр японского: словарь, карточки с интервальным повторением,
викторина, тест, чтение, разбор кандзи, а также тексты и предложения (генерация — через Claude).

## Стек

Next.js 16 · React 19 · Tailwind 4 · SQLite (`node:sqlite` на сервере, sql.js в браузере).
Слой данных (`src/lib/repo.js`) один и тот же на сервере и офлайн в браузере.

## Запуск

```bash
pnpm install
pnpm dev        # http://localhost:2323
```

Генерация текстов и «level up» требуют Claude: либо локальный Claude Code CLI (вход через `claude`),
либо `ANTHROPIC_API_KEY` в `.env.local` (шаблон — `.env.example`). Без ключа работают все режимы, кроме генерации.

## Сборки

```bash
pnpm build        # серверная сборка (API-роуты + файл SQLite)
pnpm build:mobile # статика в ./out (данные локально: sql.js + IndexedDB)
pnpm ios          # статика + Capacitor → Xcode
```

`./out` — самодостаточная статика: её можно выложить на GitHub Pages / Cloudflare Pages / Netlify.
В статической версии генерация недоступна (нет сервера).
