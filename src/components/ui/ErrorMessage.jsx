export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 rounded-md border border-rose-300 px-2 py-1 text-xs font-medium hover:bg-rose-100"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
