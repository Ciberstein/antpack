import { NextResponse } from "next/server";
import { getTasks, STATUSES } from "@/lib/db";

// GET /api/metrics
export async function GET() {
  const tasks = getTasks();

  const byStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status).length;
    return acc;
  }, {});

  const total = tasks.length;
  const completed = byStatus.completed || 0;
  const completedPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return NextResponse.json({
    total,
    byStatus,
    completedPercentage,
  });
}
