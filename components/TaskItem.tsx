"use client";

import { useState } from "react";
import PriorityBadge from "./PriorityBadge";
import TaskForm from "./TaskForm";

type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (
    id: string,
    data: { title: string; notes: string; priority: Priority }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <TaskForm
          initial={{
            title: task.title,
            notes: task.notes ?? "",
            priority: task.priority,
          }}
          submitLabel="Save Changes"
          onSubmit={async (data) => {
            await onUpdate(task.id, data);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          aria-label={`Mark "${task.title}" as ${
            task.completed ? "incomplete" : "complete"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-medium text-slate-900 ${
                task.completed ? "line-through text-slate-500" : ""
              }`}
            >
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.notes && (
            <p
              className={`mt-1 text-sm text-slate-600 whitespace-pre-wrap ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.notes}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={loading}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
