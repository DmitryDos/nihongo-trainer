import { generateText, generationMethod } from "@/lib/claude";
import { listWords, addText } from "@/lib/repo-server";
import { pickWeighted } from "@/lib/weights";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request) {
  if (generationMethod() === "none") {
    return Response.json(
      { error: "Генерация недоступна: не найден Claude Code CLI и не задан ANTHROPIC_API_KEY." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { kind = "text", level = "N5", pos, count = 12 } = body;

  // Целевые слова по весам (упор на те, что чаще выпадают / хуже выучены).
  const all = listWords({ pos });
  const chosen = [];
  const used = new Set();
  for (let i = 0; i < Math.min(count, all.length); i++) {
    const w = pickWeighted(all.filter((x) => !used.has(x.id)));
    if (!w) break;
    used.add(w.id);
    chosen.push(w);
  }

  let gen;
  try {
    gen = await generateText({ kind, level, words: chosen });
  } catch (e) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
  if (!gen.japanese || !gen.russian) {
    return Response.json({ error: "Пустой ответ генерации" }, { status: 500 });
  }

  const saved = addText({ ...gen, source: "generated" });
  return Response.json({ text: saved });
}
