import { getSetting, setSetting } from "@/lib/repo-server";
import { generationMethod } from "@/lib/claude";

export const dynamic = "force-dynamic";

export async function GET() {
  const method = generationMethod();
  return Response.json({
    canGenerate: method !== "none",
    method, // 'subscription' | 'apikey' | 'none'
    level: getSetting("level", "N5"),
    font: getSetting("font", "noto"),
  });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.key) return Response.json({ error: "Нужен key" }, { status: 400 });
  return Response.json({ setting: setSetting(body.key, body.value) });
}
