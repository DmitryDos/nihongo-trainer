// Серверная сборка разбора кандзи из офлайн-словаря.
// Источники (офлайн, вшиты в репозиторий):
//   kanji-info.json     — чтения on/kun, значения (англ.), число черт, визуальные
//                         компоненты (kanjidic2 + KRADFILE / hoffmannjp/krad-unicode).
//   kanji-radicals.json — русские значения 254 компонентов-радикалов.
//   kanji-annotations.json — курируемая разметка кандзи нашего словаря: тип знака
//                         (形声/会意/象形/…) и разбиение на смысловой (sem) и
//                         фонетический (phon) компоненты. Пополняется с ростом словаря.
import INFO from "./kanji-info.json";
import RADICALS from "./kanji-radicals.json";
import ANN from "./kanji-annotations.json";
import { extractKanji } from "./kanji.js";

// Тип знака: японское название + русское пояснение.
const TYPE = {
  ps: { ja: "形声", ru: "фоно-семантический" },
  id: { ja: "会意", ru: "идеографический (составной по смыслу)" },
  pg: { ja: "象形", ru: "пиктограмма (рисунок)" },
  si: { ja: "指事", ru: "указательный знак" },
  un: { ja: "", ru: "составной знак" },
};

// Значение символа: русский глосс радикала, если есть; иначе английские значения.
function meaningOf(ch) {
  if (RADICALS[ch]) return RADICALS[ch];
  const info = INFO[ch];
  if (info?.m?.length) return info.m.slice(0, 3).join(", ").toLowerCase();
  return null;
}

// Этимологический разбор (смысл/звук) из курируемой разметки.
// Компонент показываем только если он информативен: у смыслового есть значение,
// у фонетика — чтение или значение (иначе выходила бы пустая строка с одним
// редким под-иероглифом, напр. 㠯 в 帰).
function etymOf(ch) {
  const a = ANN[ch];
  if (!a) return null;
  const type = TYPE[a.t] || TYPE.un;
  const etym = { code: a.t, type: type.ja, typeRu: type.ru };
  if (a.sem) {
    const meaning = meaningOf(a.sem);
    if (meaning) etym.semantic = { char: a.sem, meaning };
  }
  if (a.phon) {
    const meaning = meaningOf(a.phon);
    const on = INFO[a.phon]?.on || []; // 音-чтения, которые подсказывает фонетик
    if (on.length || meaning) etym.phonetic = { char: a.phon, meaning, on };
  }
  return etym;
}

// Разбор одного кандзи.
export function breakdownKanji(ch) {
  const info = INFO[ch];
  const parts = (info?.p || []).map((p) => ({ char: p, meaning: meaningOf(p) }));
  return {
    char: ch,
    meaning: meaningOf(ch),
    on: info?.on || [],
    kun: info?.kun || [],
    strokes: info?.s || null,
    parts,
    etym: etymOf(ch),
    known: !!info,
  };
}

// Разбор всех кандзи внутри строки (слова/фразы) в порядке появления.
export function breakdownWord(text) {
  return extractKanji(text).map(breakdownKanji);
}
