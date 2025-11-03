import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import yaml from "yaml";

export async function POST(req: Request) {
  try {
    const { session_id, form_id, step_id, value } = await req.json();

    if (!form_id || !step_id) {
      return NextResponse.json(
        { error: "form_id and step_id are required" },
        { status: 400 }
      );
    }

    // Load form from database
    const form = await db.getForm(form_id);

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Parse YAML configuration
    const data = yaml.parse(form.yaml_config);
    const step = data.flow.steps[step_id];

    if (!step) {
      return NextResponse.json(
        { error: "Step not found" },
        { status: 404 }
      );
    }

    const next_step_id = step.next;
    const next_step = data.flow.steps[next_step_id];

    return NextResponse.json({ next_step_id, next_step });
  } catch (error) {
    console.error("Session answer error:", error);
    return NextResponse.json(
      { error: "Failed to process answer" },
      { status: 500 }
    );
  }
}
