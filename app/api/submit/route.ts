import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateInvoiceFromFormData } from "@/lib/invoice-generator";
import { sendInvoiceToCustomerAndContractor } from "@/lib/email-sender";

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

    // Get form to check for webhook and owner
    const form = await db.getForm(form_id);

    // Generate and send invoice if:
    // 1. Form has invoice generation enabled
    // 2. OpenAI and Resend are configured
    // 3. Form has an owner
    if (form?.generate_invoice && process.env.OPENAI_API_KEY && process.env.RESEND_API_KEY && form?.user_id) {
      try {
        // Get contractor profile for their email
        const contractorProfile = await db.getUserProfile(form.user_id);

        if (contractorProfile?.email) {
          console.log("📧 Generating invoice with OpenAI...");

          // Generate invoice using OpenAI
          const invoice = await generateInvoiceFromFormData(
            answers,
            contractorProfile.company_name || undefined
          );

          console.log("✅ Invoice generated:", invoice.invoiceNumber);

          // Send emails to customer and contractor
          const emailResult = await sendInvoiceToCustomerAndContractor(
            invoice,
            contractorProfile.email
          );

          if (emailResult.customerSent) {
            console.log("📧 Invoice sent to customer:", invoice.customerEmail);
          }
          if (emailResult.contractorSent) {
            console.log("📧 Invoice copy sent to contractor:", contractorProfile.email);
          }
          if (emailResult.errors.length > 0) {
            console.error("⚠️ Email errors:", emailResult.errors);
          }
        } else {
          console.log("⚠️ Contractor profile not found or missing email - skipping invoice");
        }
      } catch (invoiceError) {
        console.error("❌ Invoice generation/sending failed:", invoiceError);
        // Don't fail the submission if invoice fails
      }
    } else {
      console.log("ℹ️ Invoice generation skipped (missing API keys or user_id)");
    }

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
