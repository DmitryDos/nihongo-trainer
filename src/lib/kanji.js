// Утилиты для кандзи — без серверных зависимостей, можно импортировать на клиенте.

// Диапазоны кандзи: CJK Unified (+ расширение A) и совместимые иероглифы.
const KANJI = /[㐀-䶿一-鿿豈-﫿]/;

export function hasKanji(str) {
  return KANJI.test(String(str || ""));
}

// Уникальные кандзи из строки в порядке появления (кана и пунктуация отбрасываются).
export function extractKanji(str) {
  const seen = new Set();
  const out = [];
  for (const ch of String(str || "")) {
    if (KANJI.test(ch) && !seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  }
  return out;
}
