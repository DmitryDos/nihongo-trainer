import { reviewProgress, generationMethod } from "@/lib/claude";
import { wordsForReview, updateWord, addWord, listWords } from "@/lib/repo-server";
import { normJa } from "@/lib/japanese";
import { NEW_WORD_WEIGHT, WEIGHT_MIN, WEIGHT_MAX } from "@/lib/weights";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  if (generationMethod() === "none") {
    return Response.json(
      { error: "Недоступно: не найден Claude Code CLI и не задан ANTHROPIC_API_KEY." },
      { status: 400 }
    );
  }

  const words = wordsForReview();
  let result;
  try {
    result = await reviewProgress({ words });
  } catch (e) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }

  const existing = new Set(listWords().map((w) => normJa(w.kana)));

  let adjusted = 0;
  for (const a of result.adjustments || []) {
    if (a.id != null && Number.isFinite(a.weight)) {
      updateWord(a.id, { weight: Math.max(WEIGHT_MIN, Math.min(WEIGHT_MAX, a.weight)) });
      adjusted++;
    }
  }

  const newWords = [];
  for (const nw of result.newWords || []) {
    if (!nw.kana || existing.has(normJa(nw.kana))) continue;
    existing.add(normJa(nw.kana));
    newWords.push(addWord({ ...nw, weight: NEW_WORD_WEIGHT }));
  }

  return Response.json({ note: result.note || "", adjusted, added: newWords.length, newWords });
}
