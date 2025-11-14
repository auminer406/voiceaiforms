import { Resend } from 'resend';
import { InvoiceData, generateInvoiceHTML } from './invoice-generator';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendInvoiceEmailParams {
  invoice: InvoiceData;
  recipientEmail: string;
  recipientType: 'customer' | 'contractor';
}

/**
 * Sends invoice email using Resend
 */
export async function sendInvoiceEmail({
  invoice,
  recipientEmail,
  recipientType
}: SendInvoiceEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'invoices@formversation.com';
    const invoiceHTML = generateInvoiceHTML(invoice);

    const subject = recipientType === 'customer'
      ? `Invoice ${invoice.invoiceNumber} from ${invoice.companyName}`
      : `[Copy] Invoice ${invoice.invoiceNumber} - ${invoice.customerName}`;

    const textContent = recipientType === 'customer'
      ? `
Thank you for your business!

Invoice #${invoice.invoiceNumber}
Date: ${invoice.date}

Bill To: ${invoice.customerName}

Services:
${invoice.services.map(s => `- ${s.description}: $${s.total.toFixed(2)}`).join('\n')}

Subtotal: $${invoice.subtotal.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total: $${invoice.total.toFixed(2)}

${invoice.notes ? `Notes: ${invoice.notes}` : ''}

---
${invoice.companyName}
Generated via VoiceAIForms
      `.trim()
      : `
[Contractor Copy]

Invoice #${invoice.invoiceNumber} has been sent to ${invoice.customerEmail}

Customer: ${invoice.customerName}
Total: $${invoice.total.toFixed(2)}

See attached invoice details below.
      `.trim();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject,
      html: invoiceHTML,
      text: textContent,
    });

    if (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }

    return {
      success: true,
      messageId: data?.id
    };
  } catch (error: any) {
    console.error('Error sending invoice email:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending email'
    };
  }
}

/**
 * Sends invoice to both customer and contractor
 */
export async function sendInvoiceToCustomerAndContractor(
  invoice: InvoiceData,
  contractorEmail: string
): Promise<{
  customerSent: boolean;
  contractorSent: boolean;
  errors: string[]
}> {
  const errors: string[] = [];

  // Send to customer
  const customerResult = await sendInvoiceEmail({
    invoice,
    recipientEmail: invoice.customerEmail,
    recipientType: 'customer'
  });

  if (!customerResult.success) {
    errors.push(`Customer email failed: ${customerResult.error}`);
  }

  // Send to contractor
  const contractorResult = await sendInvoiceEmail({
    invoice,
    recipientEmail: contractorEmail,
    recipientType: 'contractor'
  });

  if (!contractorResult.success) {
    errors.push(`Contractor email failed: ${contractorResult.error}`);
  }

  return {
    customerSent: customerResult.success,
    contractorSent: contractorResult.success,
    errors
  };
}

/**
 * Sends service request notification to contractor
 */
export async function sendServiceRequestNotification(
  formName: string,
  answers: Record<string, any>,
  contractorEmail: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@voiceaiforms.com';

    // Build HTML email with form answers
    const answersHTML = Object.entries(answers)
      .map(([key, value]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
            ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
            ${typeof value === 'object' ? JSON.stringify(value) : value}
          </td>
        </tr>
      `)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Service Request</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 32px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                📋 New Service Request
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">
                ${formName}
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px;">
                You've received a new service request. Here are the details:
              </p>

              <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                ${answersHTML}
              </table>

              <div style="margin-top: 32px; padding: 16px; background-color: #f3f4f6; border-radius: 6px;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  <strong>Next Steps:</strong> Review the request and contact the customer to schedule service.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                Generated by VoiceAIForms • Automated Service Request Notification
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Build plain text version
    const textContent = `
New Service Request: ${formName}

${Object.entries(answers).map(([key, value]) =>
  `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${typeof value === 'object' ? JSON.stringify(value) : value}`
).join('\n')}

---
Generated by VoiceAIForms
    `.trim();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: contractorEmail,
      subject: `New Service Request: ${formName}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }

    return {
      success: true,
      messageId: data?.id
    };
  } catch (error: any) {
    console.error('Error sending service request notification:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending email'
    };
  }
}
