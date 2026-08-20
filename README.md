# Task Dashboard

Prototipo funcional de un dashboard de gestión de proyectos/tareas, construido con Next.js (App Router) y React. Incluye una API REST en el servidor (Route Handlers) y un frontend interactivo para crear, filtrar, buscar y actualizar tareas, además de un resumen de métricas.

## Cómo correrlo en local

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador. La API queda disponible en `http://localhost:3000/api/...`.

No requiere variables de entorno ni base de datos externa: los datos viven en memoria en el servidor (ver sección de arquitectura), con un set de tareas de ejemplo precargadas al iniciar.

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/tasks` | Lista todas las tareas, ordenadas de más reciente a más antigua. Soporta `?status=pending\|in_progress\|completed`. |
| `POST` | `/api/tasks` | Crea una tarea. Body: `{ title, description, priority, status }`. |
| `PATCH` | `/api/tasks/:id` | Actualiza `status` y/o `priority` de una tarea existente. Rechaza cualquier otro campo. |
| `GET` | `/api/metrics` | Total de tareas, conteo por estado y % de completadas. |

Todas las respuestas de error devuelven un JSON con `{ error, details? }` y el status HTTP correspondiente (`400` para datos inválidos, `404` para recursos inexistentes).

Ejemplos rápidos:

```bash
# Listar solo las tareas en progreso
curl "http://localhost:3000/api/tasks?status=in_progress"

# Crear una tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","description":"Detalle","priority":"high","status":"pending"}'

# Cambiar la prioridad de la tarea 3
curl -X PATCH http://localhost:3000/api/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"priority":"low"}'
```

## Decisiones de arquitectura

**Next.js con Route Handlers en vez de un backend separado.** El enunciado permitía Express/Fastify como alternativa, pero para el alcance de esta prueba un backend aparte solo agrega fricción (dos procesos, CORS, dos repos) sin ningún beneficio real. Los Route Handlers de App Router (`src/app/api/**/route.js`) corren en Node en el servidor y cubren exactamente lo que pedían los requerimientos.

**Datos en memoria en vez de una base de datos.** El store vive en `src/lib/db.js` como un array simple, guardado en `globalThis` para sobrevivir al hot-reload de Next.js en desarrollo. Es intencional: para un prototipo de esta escala, una base de datos real (SQLite/Postgres) agrega configuración sin aportar a lo que se está evaluando. La capa de acceso a datos está aislada en un módulo propio, así que migrar a Prisma/SQLite más adelante implicaría cambiar solo ese archivo.

**Validación centralizada y reutilizable.** `src/lib/validation.js` contiene funciones puras (sin dependencias de Next.js ni de HTTP) que validan tanto la creación como la actualización de tareas. Se reusan igual en el servidor (antes de tocar el store) y en el cliente (`TaskForm`, antes de hacer el POST), para dar feedback inmediato sin esperar el roundtrip a la API.

**Un solo hook (`useDashboard`) en vez de hooks separados para tasks y metrics.** Cada mutación (crear o actualizar una tarea) cambia también las métricas. Tener un hook combinado evita que ambas fuentes de datos se desincronicen y simplifica el estado de carga/error a un solo lugar. Las dos peticiones se lanzan en paralelo con `Promise.all`.

**Ordenamiento en el backend, búsqueda en el frontend.** El orden por fecha (más reciente primero) se hace en `getTasks()` para que cualquier consumidor de la API lo reciba consistente. La búsqueda por título, en cambio, se resuelve en el cliente sobre las tareas ya cargadas: es instantánea y evita una petición por cada tecla.

**Componentes globales de UI (`Button`, `Input`).** En vez de usar los componentes de MUI directamente en cada pantalla, todo pasa por dos wrappers en `src/components/ui/`. Cada uno define su estilo base y lo mergea con el `sx` puntual que reciba, así que cambiar el look de todos los botones o inputs de la app es editar un solo archivo.

**JavaScript en vez de TypeScript, sin librerías de fetching externas (SWR/React Query).** El enunciado no pedía TypeScript, y para el tamaño de este proyecto un hook simple con `fetch` + `useState`/`useEffect` es suficiente y evita dependencias adicionales.

**Tailwind CSS + MUI.** Tailwind para el layout y los contenedores (grids, spacing, responsive), MUI para los controles de formulario (inputs, selects, botones), que traen accesibilidad y estados resueltos de fábrica.

## Estructura del proyecto

```
src/
├── app/
│   ├── page.js              # Página del dashboard (Client Component)
│   ├── layout.js
│   ├── globals.css
│   └── api/
│       ├── tasks/route.js         # GET, POST
│       ├── tasks/[id]/route.js    # PATCH
│       └── metrics/route.js       # GET
├── components/
│   ├── dashboard/MetricsCards.jsx
│   ├── tasks/{TaskList,TaskCard,TaskFilters,TaskForm}.jsx
│   └── ui/{Button,Input,Spinner,ErrorMessage}.jsx
├── hooks/useDashboard.js
└── lib/{db,validation}.js
```

## Funcionalidades implementadas

- Crear tareas con validación en cliente y servidor (título de mínimo 3 caracteres, descripción obligatoria, prioridad y estado dentro de los valores permitidos).
- Actualizar el **estado** y la **prioridad** de cualquier tarea directamente desde su tarjeta, con feedback visual mientras la petición está en curso.
- Filtro por estado mediante un segmented control (Todas / Pendientes / En progreso / Completadas), resuelto en el servidor vía query param.
- Búsqueda en tiempo real por título en el cliente (bonus del enunciado).
- Tareas ordenadas de más reciente a más antigua.
- Dashboard de métricas: total, conteo por estado y porcentaje de completadas.
- Estados de carga (spinner) y manejo de errores de la API con opción de reintentar.
- Layout responsive: el formulario de creación funciona como sidebar en escritorio y se apila arriba del listado en pantallas pequeñas.

## Pendiente / posibles mejoras

- Persistencia real con SQLite/Prisma. Actualmente el store es en memoria, así que las tareas creadas se pierden al reiniciar el servidor.
- Server-Side Rendering o Server Components para la carga inicial de tareas (hoy el primer fetch ocurre en el cliente dentro de `useDashboard`).
- Reemplazar el `alert()` que aparece si falla un cambio de estado/prioridad por un toast o un mensaje inline.
- Edición del título y la descripción de una tarea (el enunciado solo pedía status y priority en el PATCH).
- Tests automatizados: las funciones de `src/lib/validation.js` son puras y serían el punto de partida natural.
