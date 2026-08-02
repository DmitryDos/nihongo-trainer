import { getStats } from "@/lib/repo-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getStats());
}
