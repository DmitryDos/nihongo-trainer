import { matchingSet } from "@/lib/repo-server";

export const dynamic = "force-dynamic";

// GET /api/matching?presetId=…  — 5 предложений, разрезанных на половины.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const presetId = searchParams.get("presetId") || undefined;
  const count = Math.max(2, Math.min(8, Number(searchParams.get("count")) || 5));
  return Response.json({ items: matchingSet({ presetId, count }) });
}
