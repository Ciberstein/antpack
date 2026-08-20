// src/lib/db.js
//
// "Base de datos" en memoria para las tareas.
//
// No usamos una base de datos real (SQLite/Postgres) para mantener el
// prototipo simple, tal como permite el enunciado ("puedes usar datos en
// memoria o una base de datos ligera").


const STATUSES = ["pending", "in_progress", "completed"];
const PRIORITIES = ["low", "medium", "high"];

function createInitialTasks() {
  const now = Date.now();
  const hours = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 1,
      title: "Configurar repositorio",
      description: "Crear el repo en GitHub y conectar el proyecto Next.js",
      priority: "high",
      status: "completed",
      createdAt: hours(72),
    },
    {
      id: 2,
      title: "Diseñar modelo de datos",
      description: "Definir la forma de una tarea y los estados posibles",
      priority: "medium",
      status: "completed",
      createdAt: hours(48),
    },
    {
      id: 3,
      title: "Construir endpoints de la API",
      description: "Implementar GET, POST y PATCH para /api/tasks",
      priority: "high",
      status: "in_progress",
      createdAt: hours(24),
    },
    {
      id: 4,
      title: "Construir dashboard de métricas",
      description:
        "Mostrar tarjetas resumen con el total y porcentaje de completadas",
      priority: "medium",
      status: "pending",
      createdAt: hours(5),
    },
    {
      id: 5,
      title: "Escribir README",
      description: "Documentar cómo correr el proyecto en local",
      priority: "low",
      status: "pending",
      createdAt: hours(1),
    },
  ];
}

// `globalThis.__taskStore` actúa como un "cajón" compartido: si ya existe
// (porque el módulo se volvió a cargar), lo reutilizamos; si no, lo creamos
// una sola vez con los datos semilla.
const store = globalThis.__taskStore || {
  tasks: createInitialTasks(),
  nextId: 6,
};
globalThis.__taskStore = store;

/**
 * Devuelve las tareas, opcionalmente filtradas por estado.
 * Si `status` no es uno de los valores válidos, devuelve `null` para que
 * la ruta que llama a esta función pueda responder con un error 400.
 */
export function getTasks(status) {
  if (!status) return store.tasks;
  if (!STATUSES.includes(status)) return null;
  return store.tasks.filter((task) => task.status === status);
}

export function getTaskById(id) {
  return store.tasks.find((task) => task.id === Number(id));
}

/**
 * Crea una tarea nueva y la agrega al store.
 * Se asume que `data` ya fue validado antes de llegar aquí.
 */
export function createTask(data) {
  const newTask = {
    id: store.nextId++,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
    createdAt: new Date().toISOString(),
  };
  store.tasks.push(newTask);
  return newTask;
}

/**
 * Actualiza una tarea existente con los campos dados (solo se espera que
 * `changes` traiga `status` y/o `priority`, eso se filtra en la ruta).
 * Devuelve `null` si el id no existe.
 */
export function updateTask(id, changes) {
  const task = getTaskById(id);
  if (!task) return null;
  Object.assign(task, changes);
  return task;
}

export { STATUSES, PRIORITIES };
