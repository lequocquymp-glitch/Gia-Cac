import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

// RFC 5545: escape commas, semicolons, backslashes, newlines
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toICSDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      where: { deadline: { not: null }, completed: false },
      include: { project: { select: { name: true } } },
      orderBy: { deadline: "asc" },
    });

    const now = new Date();
    const stamp =
      now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gia Cac Command Center//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Gia Các Command Center",
      "X-WR-TIMEZONE:Asia/Ho_Chi_Minh",
    ];

    for (const task of tasks) {
      const start = toICSDate(task.deadline!);
      const endDate = new Date(task.deadline!);
      endDate.setDate(endDate.getDate() + 1);
      const end = toICSDate(endDate);

      const summary = task.project
        ? `[${task.project.name}] ${task.title}`
        : task.title;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${task.id}@gia-cac`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeICS(summary)}`
      );
      if (task.description) {
        lines.push(`DESCRIPTION:${escapeICS(task.description)}`);
      }
      lines.push("STATUS:CONFIRMED", "END:VEVENT");
    }

    lines.push("END:VCALENDAR");

    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="gia-cac.ics"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar" },
      { status: 500 }
    );
  }
}
