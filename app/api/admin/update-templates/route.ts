import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API Endpoint: Update Invoice Templates
 * 
 * This endpoint UPDATES the YAML config for existing invoice templates.
 * Run by visiting: http://localhost:3000/api/admin/update-templates
 */

const templates = [
  {
    name: 'HVAC Service Invoice',
    id: '87984082-cf24-4b0b-9b74-55d091d407af',
    file: 'hvac-service-invoice.yaml',
  },
  {
    name: 'Plumbing Service Invoice',
    id: '0bbbf89f-f7a1-4b00-9e93-40757801fd34',
    file: 'plumber-service-invoice.yaml',
  },
  {
    name: 'Handyman Service Invoice',
    id: '9a560586-bbec-4ab4-870c-e1e9ee5b5697',
    file: 'handyman-service-invoice.yaml',
  },
  {
    name: 'Electrical Service Invoice',
    id: '8e6cf15e-6be2-4a32-89cc-82fb33eb9fb3',
    file: 'electrician-service-invoice.yaml',
  },
  {
    name: 'Service Invoice',
    id: '15ef0e1c-529c-4fae-9f17-f02b6328345f',
    file: 'generic-service-invoice.yaml',
  },
];

export async function GET() {
  try {
    // Require authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please sign in first' },
        { status: 401 }
      );
    }

    const results = [];
    const errors = [];

    for (const template of templates) {
      try {
        // Read YAML file from public/forms directory
        const yamlPath = join(process.cwd(), 'public', 'forms', template.file);
        let yamlConfig: string;
        
        try {
          yamlConfig = readFileSync(yamlPath, 'utf-8');
        } catch (err) {
          errors.push({
            template: template.name,
            error: `File not found: ${template.file}`,
          });
          continue;
        }

        // Update the YAML config for this form
        const result = await sql`
          UPDATE forms 
          SET yaml_config = ${yamlConfig}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${template.id}
          RETURNING id, name
        `;

        if (result.rows.length > 0) {
          results.push({
            template: template.name,
            status: 'updated',
            formId: template.id,
            url: `/demo?formId=${template.id}`,
          });
        } else {
          errors.push({
            template: template.name,
            error: 'Form not found in database',
          });
        }

      } catch (error: any) {
        errors.push({
          template: template.name,
          error: error.message || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Template update complete',
      userId,
      results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: templates.length,
        updated: results.length,
        failed: errors.length,
      },
    });

  } catch (error: any) {
    console.error('Error updating templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update templates',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
