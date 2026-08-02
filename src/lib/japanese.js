// Чистая логика сравнения ответов — без серверных зависимостей,
// поэтому её можно импортировать и на клиенте (мгновенная проверка ввода).

// Катакана -> хирагана (для лояльного сравнения чтений).
export function toHiragana(str) {
  return String(str || "").replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// Нормализация японского: NFKC, катакана->хирагана, убрать пробелы и знаки препинания.
// Долгий знак ー сохраняем — он значим для чтения.
export function normJa(str) {
  return toHiragana(String(str || "").normalize("NFKC"))
    .replace(/[\s　]/g, "")
    // знаки препинания + заполнители-плейсхолдеры (〜～~…‥) из шаблонов вроде «あまり〜ない»
    .replace(/[。、．，！？!?「」『』（）()･・〜～~…‥]/g, "")
    .toLowerCase()
    .trim();
}

// Нормализация русского: нижний регистр, ё->е, убрать скобки и хвостовую пунктуацию.
export function normRu(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[()]/g, "")
    .replace(/[.!?,:;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitVariants(str) {
  return String(str || "")
    .split(/[;,/、]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Ромадзи -> хирагана (поддержка транслитерации, например "kaimonosuru").
const ROMAJI = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ",
  za: "ざ", zi: "じ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", ti: "ち", chi: "ち", tu: "つ", tsu: "つ", te: "て", to: "と",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", hu: "ふ", fu: "ふ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", n: "ん",
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", sya: "しゃ", syu: "しゅ", syo: "しょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", jya: "じゃ", jyu: "じゅ", jyo: "じょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
};

export function romajiToKana(input) {
  let s = String(input || "")
    .toLowerCase()
    .replace(/[’＇｀´]/g, "'") // варианты апострофа -> ASCII '
    .replace(/[^a-z']/g, ""); // буквы + апостроф (явный разделитель ん, напр. hon'ya)
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    // апостроф — явный разделитель мор (прежде всего для ん: hon'ya -> ほんや)
    if (c === "'") { i += 1; continue; }
    // сокуон (удвоение согласной): kk, tt, pp, ss... -> っ
    if (i + 1 < s.length && c === s[i + 1] && !"aeioun".includes(c)) {
      out += "っ";
      i += 1;
      continue;
    }
    // ん: "n'"/"nn" (явные) либо "n" перед согласной/в конце.
    // При "nn" съедаем только одну n — вторая начинает следующую мору
    // (sonna -> そんな, kantanna -> かんたんな, konnichiwa -> こんにちは).
    if (c === "n") {
      const next = s[i + 1];
      if (next === undefined) { out += "ん"; i += 1; continue; }
      if (next === "'") { out += "ん"; i += 2; continue; }
      if (next === "n") { out += "ん"; i += 1; continue; }
      if (!"aiueoy".includes(next)) { out += "ん"; i += 1; continue; }
    }
    let matched = false;
    for (const len of [3, 2, 1]) {
      const chunk = s.substr(i, len);
      if (ROMAJI[chunk]) { out += ROMAJI[chunk]; i += len; matched = true; break; }
    }
    if (!matched) { out += c; i += 1; }
  }
  return out;
}

function matchesAny(input, targetsNorm) {
  const a = normJa(input);
  if (a && targetsNorm.includes(a)) return true;
  if (/[a-zA-Z]/.test(String(input || ""))) {
    const r = normJa(romajiToKana(input));
    if (r && targetsNorm.includes(r)) return true;
  }
  return false;
}

// Убрать приписки-пояснения в скобках: "холодный (на ощупь)" -> "холодный".
// Поддерживаем и ASCII (), и полноширинные （）.
function stripParens(str) {
  return String(str || "")
    .replace(/[（(][^（()）]*[）)]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// な у な-прилагательных — грамматическая связка (появляется только перед
// существительным); в словарной форме её нет. Слова хранятся без неё (便利, きれい),
// но принимаем и форму со связкой: для прилагательных добавляем варианты и с な, и без.
function naAdjVariants(targetsNorm, word) {
  if (word?.pos !== "adjective") return targetsNorm;
  const out = new Set(targetsNorm);
  for (const t of targetsNorm) {
    if (t.length > 1 && t.endsWith("な")) out.add(t.slice(0, -1));
    else out.add(t + "な");
  }
  return [...out];
}

// Ввод чтения (кана или ромадзи) для показанного кандзи.
export function checkReading(input, word) {
  const targets = naAdjVariants(
    splitVariants(word.kana).map(normJa).filter(Boolean),
    word
  );
  return matchesAny(input, targets);
}

// Ответ на японском (RU -> JP): принимаем кандзи, кану и ромадзи.
export function checkJapanese(input, word) {
  const targets = naAdjVariants(
    [
      ...splitVariants(word.kanji).map(normJa),
      ...splitVariants(word.kana).map(normJa),
    ].filter(Boolean),
    word
  );
  return matchesAny(input, targets);
}

// Ответ на русском (JP -> RU): точное совпадение с любым из вариантов перевода.
// Приписки в скобках необязательны — принимаем и полный вариант, и «ядро» без них.
// Опечатки не прощаются автоматически — для этого есть кнопка «Принять ответ».
export function checkRussian(input, word) {
  const a = normRu(input);
  if (!a) return false;
  const targets = new Set();
  for (const v of splitVariants(word.russian)) {
    const full = normRu(v);
    if (full) targets.add(full);
    const core = normRu(stripParens(v));
    if (core) targets.add(core);
  }
  return targets.has(a);
}

// Универсальная проверка по направлению/режиму.
export function checkAnswer(input, word, { mode, direction }) {
  if (mode === "reading") return checkReading(input, word);
  if (direction === "ru2jp") return checkJapanese(input, word);
  return checkRussian(input, word); // jp2ru по умолчанию
}
