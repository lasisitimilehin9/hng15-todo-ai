"use client";

import TaskItem, { Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (
    id: string,
    data: { title: string; notes: string; priority: "LOW" | "MEDIUM" | "HIGH" }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskList({
  tasks,
  loading,
  onToggle,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Loading tasks...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-slate-500">No tasks yet.</p>
        <p className="mt-1 text-sm text-slate-400">
          Create your first task using the form above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
