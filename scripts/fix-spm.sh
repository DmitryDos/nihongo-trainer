#!/usr/bin/env bash
# Лечение бага SPM у Capacitor: "…/Capacitor.xcframework.zip already exists in file system".
#
# Причина: Capacitor тянет Capacitor/Cordova как .binaryTarget(url:…zip). Xcode-команда
# «File → Packages → Reset Package Caches» чистит резолв НАПОЛОВИНУ (оставляет зипы в
# ~/Library/Caches/org.swift.swiftpm/artifacts/), и следующий резолв падает на «already exists».
# Также баг ловится, если Xcode и `xcodebuild` резолвят ОДНОВРЕМЕННО.
#
# Поэтому: НЕ пользуйся «Reset Package Caches» в Xcode — используй этот скрипт.
set -e
cd "$(dirname "$0")/.."

echo "→ гашу Xcode и стрэй-процессы SPM…"
osascript -e 'tell application "Xcode" to quit' 2>/dev/null || true
sleep 3
pkill -f 'xcodebuild' 2>/dev/null || true
pkill -f 'swift-frontend' 2>/dev/null || true
pkill -f 'swiftpm' 2>/dev/null || true

if pgrep -x Xcode >/dev/null; then
  echo "⚠ Xcode ещё запущен — закрой его вручную (⌘Q) и запусти скрипт снова."
  exit 1
fi

echo "→ сношу кэш SPM и SourcePackages проекта…"
rm -rf ~/Library/Caches/org.swift.swiftpm
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*

echo "→ один чистый резолв (без параллельных процессов)…"
xcodebuild -resolvePackageDependencies -project ios/App/App.xcodeproj -scheme App

echo "✓ Готово. Открой Xcode (pnpm exec cap open ios) и собирай — НЕ трогай File → Packages."
