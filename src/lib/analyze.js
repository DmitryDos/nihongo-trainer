// Разбор японского текста на слова по базе (без внешнего токенайзера).
// Жадный поиск самого длинного совпадения; для глаголов/прилагательных
// дополнительно ловим спряжённые формы по основе + окуригана (хвост из хираганы).
// Возвращает сегменты: { text, wordId?, reading?, meaning?, pos? }.

const HIRAGANA = /[ぁ-ゟ]/;

function buildIndex(words) {
  const entries = [];
  for (const w of words || []) {
    const kanji = (w.kanji || "").trim();
    const kana = (w.kana || "").trim();
    if (kanji) entries.push({ surface: kanji, w, stem: false });
    if (kana) entries.push({ surface: kana, w, stem: false });
    if (w.pos === "verb" || w.pos === "adjective") {
      if (kanji.length >= 2) entries.push({ surface: kanji.slice(0, -1), w, stem: true });
      if (kana.length >= 2) entries.push({ surface: kana.slice(0, -1), w, stem: true });
    }
  }
  // Длинные совпадения приоритетнее; при равной длине — не-основы раньше.
  entries.sort((a, b) => b.surface.length - a.surface.length || a.stem - b.stem);
  return entries;
}

export function analyzeText(text, words) {
  const str = String(text || "");
  const index = buildIndex(words);
  const segments = [];
  let plain = "";
  let i = 0;

  const flush = () => {
    if (plain) {
      segments.push({ text: plain });
      plain = "";
    }
  };

  while (i < str.length) {
    let hit = null;
    for (const e of index) {
      if (e.surface && str.startsWith(e.surface, i)) {
        hit = e;
        break;
      }
    }
    if (hit) {
      flush();
      let len = hit.surface.length;
      if (hit.stem) {
        // доедаем окуригану/окончание (хвост хираганы после основы)
        while (i + len < str.length && HIRAGANA.test(str[i + len])) len++;
      }
      segments.push({
        text: str.substr(i, len),
        wordId: hit.w.id,
        reading: hit.w.kana,
        meaning: hit.w.russian,
        pos: hit.w.pos,
      });
      i += len;
    } else {
      plain += str[i];
      i += 1;
    }
  }
  flush();
  return segments;
}
