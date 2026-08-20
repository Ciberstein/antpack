"use client";

import { useCallback, useEffect, useState } from "react";

// Un solo hook para tasks + metrics. Los junto porque cada vez que se crea
// o actualiza una tarea, las métricas también cambian, y así evito que se
// desincronicen dos hooks separados.
export function useDashboard(status) {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksUrl = status ? `/api/tasks?status=${status}` : "/api/tasks";
      const [tasksRes, metricsRes] = await Promise.all([fetch(tasksUrl), fetch("/api/metrics")]);
      const tasksData = await tasksRes.json();
      const metricsData = await metricsRes.json();

      if (!tasksRes.ok) throw new Error(tasksData.error || "Error al cargar tareas");
      if (!metricsRes.ok) throw new Error(metricsData.error || "Error al cargar métricas");

      setTasks(tasksData.tasks);
      setMetrics(metricsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function createTask(payload) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.details?.join(" ") || data.error || "Error al crear tarea");
    }
    await fetchAll();
    return data.task;
  }

  async function updateTask(id, changes) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.details?.join(" ") || data.error || "Error al actualizar tarea");
    }
    await fetchAll();
    return data.task;
  }

  return { tasks, metrics, loading, error, createTask, updateTask, refetch: fetchAll };
}
