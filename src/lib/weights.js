// Система вероятностей выпадения слов.
// Вероятность появления слова пропорциональна его весу (weight).
// Верный ответ -> вес падает (слово реже выпадает), неверный -> вес растёт.

export const WEIGHT_MIN = 0.2;
export const WEIGHT_MAX = 8;
export const NEW_WORD_WEIGHT = 2.5; // новые слова выпадают чаще, пока не выучены

// Линейный шаг: частота меняется плавно, а не скачком.
export const WRONG_STEP = 0.6; // ошибка немного поднимает частоту
export const CORRECT_STEP = 0.5; // верный ответ немного опускает

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

// Новый вес после ответа (линейно).
export function nextWeight(current, correct) {
  const w = typeof current === "number" && current > 0 ? current : NEW_WORD_WEIGHT;
  return clamp(w + (correct ? -CORRECT_STEP : WRONG_STEP), WEIGHT_MIN, WEIGHT_MAX);
}

// Взвешенный случайный выбор слова из списка.
// excludeId — по возможности не повторять предыдущее слово подряд.
export function pickWeighted(words, { excludeId } = {}) {
  if (!words || words.length === 0) return null;
  let pool = words;
  if (excludeId != null && words.length > 1) {
    const filtered = words.filter((w) => w.id !== excludeId);
    if (filtered.length) pool = filtered;
  }
  const total = pool.reduce(
    (sum, w) => sum + Math.max(WEIGHT_MIN, Number(w.weight) || 1),
    0
  );
  let r = Math.random() * total;
  for (const w of pool) {
    r -= Math.max(WEIGHT_MIN, Number(w.weight) || 1);
    if (r <= 0) return w;
  }
  return pool[pool.length - 1];
}

// Доля вероятности слова (для отображения в UI), в процентах.
export function selectionShare(word, words) {
  const total = words.reduce(
    (sum, w) => sum + Math.max(WEIGHT_MIN, Number(w.weight) || 1),
    0
  );
  if (!total) return 0;
  return (Math.max(WEIGHT_MIN, Number(word.weight) || 1) / total) * 100;
}
