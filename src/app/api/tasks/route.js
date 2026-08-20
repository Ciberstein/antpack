import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/db";
import { validateNewTask } from "@/lib/validation";

// GET /api/tasks
// GET /api/tasks?status=pending
export async function GET(request) {
  const status = request.nextUrl.searchParams.get("status");
  const tasks = getTasks(status);

  // null significa que el status del query no es uno de los válidos
  if (tasks === null) {
    return NextResponse.json(
      { error: `status inválido: ${status}. Usa pending, in_progress o completed.` },
      { status: 400 }
    );
  }

  return NextResponse.json({ tasks });
}

// POST /api/tasks
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la petición debe ser JSON válido." },
      { status: 400 }
    );
  }

  const { valid, errors } = validateNewTask(body);
  if (!valid) {
    return NextResponse.json({ error: "Datos inválidos.", details: errors }, { status: 400 });
  }

  const newTask = createTask(body);
  return NextResponse.json({ task: newTask }, { status: 201 });
}
