"use client";

import { useCallback, useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/components/TaskItem";

type Priority = "LOW" | "MEDIUM" | "HIGH";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreate(data: {
    title: string;
    notes: string;
    priority: Priority;
  }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Failed to create task");
    }

    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleToggle(id: string, completed: boolean) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function handleUpdate(
    id: string,
    data: { title: string; notes: string; priority: Priority }
  ) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update task");
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err; // rethrow so TaskForm can also show the error
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          HNG15 Todo AI
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Simple to-do list · Create · Edit · Notes · Priority
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Add a new task
        </h2>
        <TaskForm onSubmit={handleCreate} />
      </section>

      {error && (
        <div
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchTasks();
            }}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Your tasks{" "}
          {!loading && (
            <span className="text-sm font-normal text-slate-400">
              ({tasks.length})
            </span>
          )}
        </h2>
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
