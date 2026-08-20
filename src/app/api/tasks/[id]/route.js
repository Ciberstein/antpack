import { NextResponse } from "next/server";
import { updateTask } from "@/lib/db";
import { validateTaskUpdate } from "@/lib/validation";

// PATCH /api/tasks/:id
// Solo permite actualizar status o priority (lo valida validateTaskUpdate)
export async function PATCH(request, { params }) {
  const { id } = await params; // en Next 15+ los params vienen como promesa

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la petición debe ser JSON válido." },
      { status: 400 }
    );
  }

  const { valid, errors } = validateTaskUpdate(body);
  if (!valid) {
    return NextResponse.json({ error: "Datos inválidos.", details: errors }, { status: 400 });
  }

  const updated = updateTask(id, body);
  if (!updated) {
    return NextResponse.json({ error: `No existe una tarea con id ${id}.` }, { status: 404 });
  }

  return NextResponse.json({ task: updated });
}
