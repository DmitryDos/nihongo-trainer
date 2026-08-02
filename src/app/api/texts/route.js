import { listTexts, deleteText } from "@/lib/repo-server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") || undefined;
  return Response.json({ texts: listTexts(kind) });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Нужен id" }, { status: 400 });
  deleteText(id);
  return Response.json({ ok: true });
}
