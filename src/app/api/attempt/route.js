import { recordAttempt, recordAttemptsBatch } from "@/lib/repo-server";

export async function POST(request) {
  const body = await request.json();
  if (Array.isArray(body.results)) {
    const updated = recordAttemptsBatch(body.results, {
      mode: body.mode,
      direction: body.direction,
    });
    return Response.json({ updated });
  }
  if (!body.wordId) return Response.json({ error: "Нужен wordId" }, { status: 400 });
  return Response.json({ word: recordAttempt(body) });
}
