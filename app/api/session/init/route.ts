import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import yaml from "yaml";

export async function POST(req: Request) {
  try {
    const { formId } = await req.json();

    if (!formId) {
      return NextResponse.json(
        { error: "formId is required" },
        { status: 400 }
      );
    }

    // Load form from database
    const form = await db.getForm(formId);

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Parse YAML configuration
    const data = yaml.parse(form.yaml_config);

    if (!data?.flow?.steps) {
      return NextResponse.json(
        { error: "Invalid form configuration" },
        { status: 500 }
      );
    }

    const startId = data.flow.start;
    const firstStep = data.flow.steps[startId];

    return NextResponse.json({
      session_id: Math.random().toString(36).slice(2),
      form_id: formId,
      step_id: startId,
      step: firstStep,
    });
  } catch (error) {
    console.error("Session init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize session" },
      { status: 500 }
    );
  }
}
