import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { form_id, answers } = body;

    if (!form_id || !answers) {
      return NextResponse.json(
        { error: "form_id and answers are required" },
        { status: 400 }
      );
    }

    // Get client metadata
    const metadata = {
      user_agent: req.headers.get("user-agent") || undefined,
      referer: req.headers.get("referer") || undefined,
    };

    // Store submission in database
    const submission = await db.createSubmission({
      form_id,
      answers,
      metadata,
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Failed to store submission" },
        { status: 500 }
      );
    }

    console.log("✅ Formversation submission saved:", submission.id);

    // Get form to check for webhook
    const form = await db.getForm(form_id);

    // Optional: forward to webhook if configured
    if (form?.webhook_url) {
      try {
        await fetch(form.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submission_id: submission.id,
            form_id,
            answers,
            submitted_at: submission.submitted_at,
          }),
        });
        console.log("📬 Forwarded to webhook:", form.webhook_url);
      } catch (webhookError) {
        console.error("❌ Webhook delivery failed:", webhookError);
        // Don't fail the submission if webhook fails
      }
    }

    // Also support legacy SUBMIT_WEBHOOK_URL env var
    if (process.env.SUBMIT_WEBHOOK_URL) {
      try {
        await fetch(process.env.SUBMIT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submission_id: submission.id,
            form_id,
            answers,
            submitted_at: submission.submitted_at,
          }),
        });
        console.log("📬 Forwarded to legacy webhook:", process.env.SUBMIT_WEBHOOK_URL);
      } catch (webhookError) {
        console.error("❌ Legacy webhook delivery failed:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
      message: "Submission received",
    });
  } catch (error) {
    console.error("❌ Error processing submission:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
