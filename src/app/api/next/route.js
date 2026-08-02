import { pickNext } from "@/lib/repo-server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = pickNext({
    pos: searchParams.get("pos") || undefined,
    topic: searchParams.get("topic") || undefined,
    excludeId: searchParams.get("excludeId") || undefined,
    presetId: searchParams.get("presetId") || undefined,
  });
  if (!word) {
    return Response.json({ word: null, error: "Нет слов под выбранный фильтр" });
  }
  return Response.json({ word });
}
