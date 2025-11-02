import { NextResponse } from "next/server";
import { loadFlow } from "@/lib/flow";

export async function POST(req: Request) {
  const { session_id, step_id, value } = await req.json();
  const flow = loadFlow("early-access-v1");
  const step = flow.flow.steps[step_id];
  const next_step_id = step.next;
  const next_step = flow.flow.steps[next_step_id];
  return NextResponse.json({ next_step_id, next_step });
}
