import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Priority } from "@prisma/client";

const VALID_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, notes, priority } = body as {
      title?: unknown;
      notes?: unknown;
      priority?: unknown;
    };

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    let taskPriority: Priority = "MEDIUM";
    if (priority) {
      if (!VALID_PRIORITIES.includes(priority as Priority)) {
        return NextResponse.json(
          { error: "Priority must be one of: LOW, MEDIUM, HIGH" },
          { status: 400 }
        );
      }
      taskPriority = priority as Priority;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        notes: notes && typeof notes === "string" ? notes.trim() : null,
        priority: taskPriority,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
