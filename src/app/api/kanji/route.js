import { breakdownWord, breakdownKanji } from "@/lib/kanji-info";
import { listWords } from "@/lib/repo-server";
import { extractKanji } from "@/lib/kanji";

export const dynamic = "force-dynamic";

// GET /api/kanji?chars=食べる — разбор кандзи в строке.
// GET /api/kanji                — все уникальные кандзи из словаря (для вкладки «Кандзи»).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const chars = searchParams.get("chars");
  if (chars) return Response.json({ items: breakdownWord(chars) });

  const seen = new Set();
  const kanji = [];
  for (const w of listWords()) {
    for (const ch of extractKanji(w.kanji || "")) {
      if (!seen.has(ch)) {
        seen.add(ch);
        kanji.push(ch);
      }
    }
  }
  const items = kanji
    .map(breakdownKanji)
    .sort((a, b) => (a.strokes || 99) - (b.strokes || 99) || a.char.localeCompare(b.char));
  return Response.json({ items });
}
