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
