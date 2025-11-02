import { NextResponse } from "next/server";
import { loadFlow } from "@/lib/flow";

export async function POST(req: Request) {
  const { flowId = "early-access-v1" } = await req.json();
  const data = loadFlow(flowId);
  const startId = data.flow.start;
  const firstStep = data.flow.steps[startId];
  return NextResponse.json({
    session_id: Math.random().toString(36).slice(2),
    step_id: startId,
    step: firstStep,
  });
}
