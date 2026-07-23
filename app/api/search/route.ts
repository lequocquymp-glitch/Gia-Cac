import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ tasks: [], knowledge: [] });
    }

    const [tasks, knowledge] = await Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 20,
      }),
      prisma.knowledge.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 20,
      }),
    ]);

    return NextResponse.json({ tasks, knowledge });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
