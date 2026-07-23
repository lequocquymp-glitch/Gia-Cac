import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const knowledge = await prisma.knowledge.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("GET /api/knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, type, content, tags } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "ProjectId and title are required" },
        { status: 400 }
      );
    }

    const knowledge = await prisma.knowledge.create({
      data: {
        projectId,
        title,
        type: type || "document",
        content,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
      },
    });

    return NextResponse.json(knowledge, { status: 201 });
  } catch (error) {
    console.error("POST /api/knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge" },
      { status: 500 }
    );
  }
}
