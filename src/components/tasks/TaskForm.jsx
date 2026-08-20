"use client";

import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const initialForm = { title: "", description: "", priority: "medium", status: "pending" };

export function TaskForm({ onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs = [];
    if (form.title.trim().length < 3) errs.push("El título debe tener al menos 3 caracteres.");
    if (form.description.trim().length === 0) errs.push("La descripción no puede estar vacía.");
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors([]);
    try {
      await onCreate(form);
      setForm(initialForm);
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 font-medium text-slate-900">Nueva tarea</h2>
      <p className="mb-4 text-xs text-slate-500">Los cuatro campos son obligatorios.</p>

      {errors.length > 0 && (
        <ul className="mb-3 list-inside list-disc rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            multiline
            rows={2}
          />
        </div>

        <Input
          select
          label="Prioridad"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <MenuItem value="low">Baja</MenuItem>
          <MenuItem value="medium">Media</MenuItem>
          <MenuItem value="high">Alta</MenuItem>
        </Input>

        <Input
          select
          label="Estado"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="in_progress">En progreso</MenuItem>
          <MenuItem value="completed">Completada</MenuItem>
        </Input>
      </div>

      <Button type="submit" disabled={submitting} fullWidth sx={{ mt: 3 }}>
        {submitting ? "Creando..." : "Crear tarea"}
      </Button>
    </form>
  );
}
