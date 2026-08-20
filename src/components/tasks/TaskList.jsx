import { TaskCard } from "./TaskCard";

export function TaskList({ tasks, search, onStatusChange, onPriorityChange, updatingId }) {
  const filtered = search
    ? tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <p className="text-sm text-slate-500">No hay tareas para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
          updating={updatingId === task.id}
        />
      ))}
    </div>
  );
}
