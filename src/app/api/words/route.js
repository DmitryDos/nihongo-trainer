import { listWords, addWord, updateWord, deleteWord } from "@/lib/repo-server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const words = listWords({
    pos: searchParams.get("pos") || undefined,
    topic: searchParams.get("topic") || undefined,
    search: searchParams.get("search") || undefined,
  });
  return Response.json({ words });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.kana || !body.russian) {
    return Response.json(
      { error: "Нужны как минимум чтение (кана) и перевод" },
      { status: 400 }
    );
  }
  return Response.json({ word: addWord(body) });
}

export async function PATCH(request) {
  const body = await request.json();
  if (!body.id) return Response.json({ error: "Нужен id" }, { status: 400 });
  return Response.json({ word: updateWord(body.id, body) });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Нужен id" }, { status: 400 });
  deleteWord(id);
  return Response.json({ ok: true });
}
