/**
 * Automated API endpoint tests for the Task resource.
 *
 * These tests verify request validation and response shapes.
 * Full end-to-end database tests require a running DATABASE_URL
 * and `prisma generate` + `prisma db push`.
 *
 * Run with: npm test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Shared in-memory store so tests can reset state between runs
const mockStore = {
  tasks: [] as any[],
  idCounter: 1,
};

// Mock Prisma before importing the routes
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      task: {
        findMany: vi.fn(async () => [...mockStore.tasks].reverse()),
        findUnique: vi.fn(async ({ where }: any) =>
          mockStore.tasks.find((t) => t.id === where.id) ?? null
        ),
        create: vi.fn(async ({ data }: any) => {
          const task = {
            id: `task_${mockStore.idCounter++}`,
            title: data.title,
            notes: data.notes ?? null,
            completed: data.completed ?? false,
            priority: data.priority ?? "MEDIUM",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockStore.tasks.push(task);
          return task;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const idx = mockStore.tasks.findIndex((t) => t.id === where.id);
          if (idx === -1) throw new Error("Not found");
          mockStore.tasks[idx] = {
            ...mockStore.tasks[idx],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return mockStore.tasks[idx];
        }),
        delete: vi.fn(async ({ where }: any) => {
          const idx = mockStore.tasks.findIndex((t) => t.id === where.id);
          if (idx === -1) throw new Error("Not found");
          const [deleted] = mockStore.tasks.splice(idx, 1);
          return deleted;
        }),
      },
    },
  };
});

// Helper to create a mock NextRequest
function mockRequest(body?: unknown, method = "GET") {
  return {
    json: async () => body,
    method,
  } as any;
}

beforeEach(() => {
  vi.clearAllMocks();
  // Reset in-memory store so every test starts clean
  mockStore.tasks = [];
  mockStore.idCounter = 1;
});

describe("API /api/tasks", () => {
  it("GET returns an array of tasks", async () => {
    const { GET } = await import("@/app/api/tasks/route");
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST creates a task with valid data", async () => {
    const { POST } = await import("@/app/api/tasks/route");
    const req = mockRequest({
      title: "Test task",
      notes: "Some notes",
      priority: "HIGH",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.title).toBe("Test task");
    expect(data.notes).toBe("Some notes");
    expect(data.priority).toBe("HIGH");
    expect(data.completed).toBe(false);
    expect(data.id).toBeDefined();
  });

  it("POST rejects empty title", async () => {
    const { POST } = await import("@/app/api/tasks/route");
    const req = mockRequest({ title: "   " });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/title/i);
  });

  it("POST rejects invalid priority", async () => {
    const { POST } = await import("@/app/api/tasks/route");
    const req = mockRequest({ title: "Valid", priority: "URGENT" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/priority/i);
  });

  it("POST defaults priority to MEDIUM", async () => {
    const { POST } = await import("@/app/api/tasks/route");
    const req = mockRequest({ title: "No priority given" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.priority).toBe("MEDIUM");
  });
});

describe("API /api/tasks/[id]", () => {
  it("GET returns 404 for unknown id", async () => {
    const { GET } = await import("@/app/api/tasks/[id]/route");
    const res = await GET(mockRequest(), {
      params: Promise.resolve({ id: "nonexistent" }),
    });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toMatch(/not found/i);
  });

  it("PUT updates an existing task", async () => {
    // First create a task via the mocked POST path
    const { POST } = await import("@/app/api/tasks/route");
    const createRes = await POST(
      mockRequest({ title: "Original", priority: "LOW" })
    );
    const created = await createRes.json();

    const { PUT } = await import("@/app/api/tasks/[id]/route");
    const res = await PUT(
      mockRequest({
        title: "Updated title",
        notes: "Updated notes",
        completed: true,
        priority: "HIGH",
      }),
      { params: Promise.resolve({ id: created.id }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Updated title");
    expect(data.notes).toBe("Updated notes");
    expect(data.completed).toBe(true);
    expect(data.priority).toBe("HIGH");
  });

  it("DELETE removes a task", async () => {
    const { POST } = await import("@/app/api/tasks/route");
    const createRes = await POST(mockRequest({ title: "To delete" }));
    const created = await createRes.json();

    const { DELETE } = await import("@/app/api/tasks/[id]/route");
    const res = await DELETE(mockRequest(), {
      params: Promise.resolve({ id: created.id }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/deleted/i);
  });

  it("DELETE returns 404 for unknown id", async () => {
    const { DELETE } = await import("@/app/api/tasks/[id]/route");
    const res = await DELETE(mockRequest(), {
      params: Promise.resolve({ id: "does-not-exist" }),
    });
    const data = await res.json();

    expect(res.status).toBe(404);
  });
});
