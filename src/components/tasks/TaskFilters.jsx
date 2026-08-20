import { Button } from "../ui/Button";

const FILTERS = [
  { value: "", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completadas" },
];

export function TaskFilters({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 rounded-xl border border-slate-200 bg-slate-100 p-1">
      {FILTERS.map((filter) => {
        const selected = value === filter.value;
        return (
          <Button
            key={filter.value}
            size="small"
            disableRipple
            onClick={() => onChange(filter.value)}
            sx={{
              minWidth: "auto",
              px: 2,
              py: 0.75,
              fontSize: "0.8125rem",
              boxShadow: selected ? "0 1px 2px rgba(15, 23, 42, 0.08)" : "none",
              backgroundColor: selected ? "#ffffff" : "transparent",
              color: selected ? "#4f46e5" : "#64748b",
              "&:hover": {
                backgroundColor: selected ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                color: selected ? "#4f46e5" : "#334155",
              },
            }}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
