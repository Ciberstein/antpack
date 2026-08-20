import MenuItem from "@mui/material/MenuItem";
import { Input } from "../ui/Input";

const PRIORITY_STYLES = {
  low: "bg-sky-50 text-sky-700 ring-sky-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  high: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const PRIORITY_LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const STATUS_STYLES = {
  pending: "bg-slate-100 text-slate-600",
  in_progress: "bg-indigo-50 text-indigo-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

export function TaskCard({ task, onStatusChange, onPriorityChange, updating }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      <p className="mt-1 flex-1 text-sm text-slate-500">{task.description}</p>

      <span
        className={`mt-3 inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
      >
        {STATUS_LABELS[task.status]}
      </span>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
        <div className="flex-1">
          <Input
            select
            size="small"
            label="Estado"
            value={task.status}
            disabled={updating}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="in_progress">En progreso</MenuItem>
            <MenuItem value="completed">Completada</MenuItem>
          </Input>
        </div>
        <div className="w-28">
          <Input
            select
            size="small"
            label="Prioridad"
            value={task.priority}
            disabled={updating}
            onChange={(e) => onPriorityChange(task.id, e.target.value)}
          >
            <MenuItem value="low">Baja</MenuItem>
            <MenuItem value="medium">Media</MenuItem>
            <MenuItem value="high">Alta</MenuItem>
          </Input>
        </div>
      </div>

      {updating && <span className="mt-2 text-xs text-slate-400">Actualizando...</span>}
    </div>
  );
}
