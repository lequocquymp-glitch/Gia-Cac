import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, type, content, tags } = body;

    const knowledge = await prisma.knowledge.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(content && { content }),
        ...(tags && { tags: Array.isArray(tags) ? tags.join(",") : tags }),
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("PATCH /api/knowledge/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.knowledge.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/knowledge/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge" },
      { status: 500 }
    );
  }
}
