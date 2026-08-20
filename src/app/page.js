"use client";

import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const { tasks, metrics, loading, error, createTask, updateTask, refetch } =
    useDashboard(statusFilter);

  async function handleTaskUpdate(id, changes) {
    setUpdatingId(id);
    try {
      await updateTask(id, changes);
    } catch (err) {
      alert(err.message); // simple por ahora, se podría mostrar inline
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Dashboard de proyectos</h1>

      <ErrorMessage message={error} onRetry={refetch} />

      {loading && !metrics ? (
        <Spinner label="Cargando métricas..." />
      ) : (
        metrics && <MetricsCards metrics={metrics} />
      )}

      <div className="mt-8 flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
        <div className="lg:w-80 lg:shrink-0">
          <TaskForm onCreate={createTask} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4">

            <TaskFilters value={statusFilter} onChange={setStatusFilter} />
            <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
              <Spinner label="Cargando tareas..." />
            ) : (
              <TaskList
                tasks={tasks}
                search={search}
                onStatusChange={(id, status) => handleTaskUpdate(id, { status })}
                onPriorityChange={(id, priority) => handleTaskUpdate(id, { priority })}
                updatingId={updatingId}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
