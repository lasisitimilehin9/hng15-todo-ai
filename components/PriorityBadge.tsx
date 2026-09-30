type Priority = "LOW" | "MEDIUM" | "HIGH";

interface PriorityBadgeProps {
  priority: Priority;
}

const styles: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-800 border-amber-200",
  HIGH: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
