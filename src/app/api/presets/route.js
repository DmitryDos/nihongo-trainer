import {
  listPresets,
  createPreset,
  updatePreset,
  deletePreset,
  getPresetOut,
  samplePosWordIds,
  weakestWordIds,
} from "@/lib/repo-server";
import { POS_OPTIONS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const POS_LABEL = Object.fromEntries(POS_OPTIONS.map((p) => [p.value, p.label]));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) return Response.json({ preset: getPresetOut(id) });
  return Response.json({ presets: listPresets() });
}

// POST { mode: "pos", pos, count } | { mode: "weakest", count } | { name, wordIds }
export async function POST(request) {
  const body = await request.json();
  const count = Math.max(1, Math.min(500, Number(body.count) || 20));
  let name = body.name;
  let wordIds;

  if (body.mode === "empty") {
    return Response.json({ preset: createPreset({ name: name || "Новый пресет", wordIds: [] }) });
  }

  if (body.mode === "weakest") {
    wordIds = weakestWordIds(count);
    name = name || "Ошибочные";
  } else if (body.mode === "pos") {
    wordIds = samplePosWordIds(body.pos, count);
    name = name || (body.pos && body.pos !== "all" ? POS_LABEL[body.pos] || body.pos : "Случайные");
  } else {
    wordIds = Array.isArray(body.wordIds) ? body.wordIds : [];
    name = name || `Пресет ×${wordIds.length}`;
  }

  if (!wordIds.length) {
    return Response.json({ error: "Нет слов для пресета" }, { status: 400 });
  }
  return Response.json({ preset: createPreset({ name, wordIds }) });
}

// PATCH { id, name?, wordIds? } — редактирование пресета (в т.ч. состав слов).
export async function PATCH(request) {
  const body = await request.json();
  if (!body.id) return Response.json({ error: "Нужен id" }, { status: 400 });
  return Response.json({ preset: updatePreset(body.id, { name: body.name, wordIds: body.wordIds }) });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Нужен id" }, { status: 400 });
  deletePreset(id);
  return Response.json({ ok: true });
}
