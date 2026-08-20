const STATUS_LABELS = {
  pending: "Pendientes",
  in_progress: "En progreso",
  completed: "Completadas",
};

export function MetricsCards({ metrics }) {
  const cards = [
    { label: "Total de tareas", value: metrics.total },
    ...Object.entries(metrics.byStatus).map(([status, count]) => ({
      label: STATUS_LABELS[status] || status,
      value: count,
    })),
    { label: "% Completadas", value: `${metrics.completedPercentage}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
