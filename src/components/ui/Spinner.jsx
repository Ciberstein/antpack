export function Spinner({ label = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
