import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Priority } from "@prisma/client";

const VALID_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, notes, completed, priority } = body as {
      title?: unknown;
      notes?: unknown;
      completed?: unknown;
      priority?: unknown;
    };

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const data: {
      title?: string;
      notes?: string | null;
      completed?: boolean;
      priority?: Priority;
    } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title must be a non-empty string" },
          { status: 400 }
        );
      }
      data.title = title.trim();
    }

    if (notes !== undefined) {
      data.notes =
        notes === null || notes === ""
          ? null
          : typeof notes === "string"
            ? notes.trim()
            : existing.notes;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return NextResponse.json(
          { error: "Completed must be a boolean" },
          { status: 400 }
        );
      }
      data.completed = completed;
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority as Priority)) {
        return NextResponse.json(
          { error: "Priority must be one of: LOW, MEDIUM, HIGH" },
          { status: 400 }
        );
      }
      data.priority = priority as Priority;
    }

    const task = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
