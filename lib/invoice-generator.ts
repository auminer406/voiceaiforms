import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface InvoiceData {
  companyName: string;
  customerName: string;
  customerEmail: string;
  services: Array<{
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  invoiceNumber: string;
  date: string;
}

/**
 * Uses OpenAI to process form submission data and generate structured invoice data
 */
export async function generateInvoiceFromFormData(
  formAnswers: Record<string, any>,
  companyName?: string
): Promise<InvoiceData> {
  try {
    const prompt = `You are an AI assistant that converts voice form data into structured invoice information for HVAC contractors.

Given the following form data from a voice conversation:
${JSON.stringify(formAnswers, null, 2)}

Extract and structure this information into an invoice with the following requirements:
1. Identify the customer name and email
2. Extract all services/work performed
3. Calculate pricing for each service (use standard HVAC rates if not explicitly provided)
4. Calculate subtotal, tax (use 8% if not specified), and total
5. Generate a unique invoice number (format: INV-YYYYMMDD-XXXX)
6. Use today's date
7. Add any relevant notes from the conversation

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "companyName": "Company name or ${companyName || 'HVAC Services'}",
  "customerName": "extracted customer name",
  "customerEmail": "extracted email",
  "services": [
    {
      "description": "service description",
      "quantity": 1,
      "rate": 100.00,
      "total": 100.00
    }
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "notes": "any additional notes",
  "invoiceNumber": "INV-20250114-0001",
  "date": "2025-01-14"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting invoice data from voice conversations. Always respond with valid JSON only, no other text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const invoiceData = JSON.parse(responseText) as InvoiceData;

    // Validate required fields
    if (!invoiceData.customerName || !invoiceData.customerEmail) {
      throw new Error('Missing required customer information');
    }

    return invoiceData;
  } catch (error) {
    console.error('Error generating invoice with OpenAI:', error);
    throw error;
  }
}

/**
 * Generates HTML invoice for email
 */
export function generateInvoiceHTML(invoice: InvoiceData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #00BFA6;
    }
    .company-info h1 {
      margin: 0;
      color: #4F46E5;
      font-size: 28px;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-number {
      font-size: 18px;
      font-weight: bold;
      color: #4F46E5;
    }
    .customer-info {
      margin-bottom: 30px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #4F46E5;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals tr td {
      padding: 8px;
    }
    .total-row {
      font-weight: bold;
      font-size: 18px;
      background: #f8f9fa;
    }
    .notes {
      margin-top: 30px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #00BFA6;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="invoice-header">
    <div class="company-info">
      <h1>${invoice.companyName}</h1>
    </div>
    <div class="invoice-details">
      <div class="invoice-number">Invoice #${invoice.invoiceNumber}</div>
      <div>Date: ${invoice.date}</div>
    </div>
  </div>

  <div class="customer-info">
    <h3>Bill To:</h3>
    <div><strong>${invoice.customerName}</strong></div>
    <div>${invoice.customerEmail}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.services.map(service => `
        <tr>
          <td>${service.description}</td>
          <td class="text-right">${service.quantity}</td>
          <td class="text-right">$${service.rate.toFixed(2)}</td>
          <td class="text-right">$${service.total.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals">
    <tr>
      <td>Subtotal:</td>
      <td class="text-right">$${invoice.subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Tax:</td>
      <td class="text-right">$${invoice.tax.toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td>Total:</td>
      <td class="text-right">$${invoice.total.toFixed(2)}</td>
    </tr>
  </table>

  ${invoice.notes ? `
    <div class="notes">
      <strong>Notes:</strong><br>
      ${invoice.notes}
    </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Generated via VoiceAIForms - Voice-powered invoicing</p>
  </div>
</body>
</html>
  `.trim();
}
