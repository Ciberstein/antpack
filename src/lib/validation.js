// src/lib/validation.js
//
// Funciones de validación puras (no dependen de Next.js ni de HTTP), para
// poder reusarlas tanto en POST /api/tasks como en PATCH /api/tasks/:id,
// y para poder probarlas de forma aislada si hiciera falta.


import { STATUSES, PRIORITIES } from "./db";

/**
 * Valida el body de POST /api/tasks.
 * Reglas del enunciado:
 * - title: string, no vacío, mínimo 3 caracteres.
 * - description: string.
 * - priority: uno de low | medium | high.
 * - status: uno de pending | in_progress | completed.
 */
function validateNewTask(data) {
  const errors = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["El cuerpo de la petición debe ser un objeto JSON."] };
  }

  const { title, description, priority, status } = data;

  if (typeof title !== "string" || title.trim().length < 3) {
    errors.push("title es requerido y debe tener al menos 3 caracteres.");
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push("description es requerido y no puede estar vacío.");
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push(`priority debe ser uno de: ${PRIORITIES.join(", ")}.`);
  }

  if (!STATUSES.includes(status)) {
    errors.push(`status debe ser uno de: ${STATUSES.join(", ")}.`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida el body de PATCH /api/tasks/:id.
 * Reglas del enunciado: "permite actualizar únicamente el status o la
 * priority de una tarea" — así que además de validar los valores,
 * rechazamos explícitamente cualquier otro campo que venga en el body
 * (por ejemplo, que alguien intente cambiar el title desde este endpoint).
 */
function validateTaskUpdate(data) {
  const errors = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["El cuerpo de la petición debe ser un objeto JSON."] };
  }

  const allowedKeys = ["status", "priority"];
  const receivedKeys = Object.keys(data);

  if (receivedKeys.length === 0) {
    errors.push("Debes enviar al menos status o priority para actualizar.");
  }

  const invalidKeys = receivedKeys.filter((key) => !allowedKeys.includes(key));
  if (invalidKeys.length > 0) {
    errors.push(
      `Solo se permite actualizar status o priority. Campo(s) no permitido(s): ${invalidKeys.join(", ")}.`
    );
  }

  if ("status" in data && !STATUSES.includes(data.status)) {
    errors.push(`status debe ser uno de: ${STATUSES.join(", ")}.`);
  }

  if ("priority" in data && !PRIORITIES.includes(data.priority)) {
    errors.push(`priority debe ser uno de: ${PRIORITIES.join(", ")}.`);
  }

  return { valid: errors.length === 0, errors };
}

export { validateNewTask, validateTaskUpdate };
