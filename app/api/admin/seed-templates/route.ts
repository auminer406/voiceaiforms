import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API Endpoint: Seed Invoice Templates
 * 
 * This endpoint creates the 5 invoice templates as forms in the database.
 * Run once by visiting: http://localhost:3000/api/admin/seed-templates
 * 
 * Templates will be owned by the authenticated user.
 */

const templates = [
  {
    name: 'HVAC Service Invoice',
    slug: 'hvac-invoice',
    file: 'hvac-service-invoice.yaml',
    theme: 'dark',
  },
  {
    name: 'Plumbing Service Invoice',
    slug: 'plumber-invoice',
    file: 'plumber-service-invoice.yaml',
    theme: 'dark',
  },
  {
    name: 'Handyman Service Invoice',
    slug: 'handyman-invoice',
    file: 'handyman-service-invoice.yaml',
    theme: 'dark',
  },
  {
    name: 'Electrical Service Invoice',
    slug: 'electrician-invoice',
    file: 'electrician-service-invoice.yaml',
    theme: 'dark',
  },
  {
    name: 'Service Invoice',
    slug: 'generic-invoice',
    file: 'generic-service-invoice.yaml',
    theme: 'dark',
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

        // Check if template already exists
        const existing = await db.getFormBySlug(template.slug);
        if (existing) {
          results.push({
            template: template.name,
            status: 'already_exists',
            formId: existing.id,
          });
          continue;
        }

        // Create form in database
        const form = await db.createForm({
          user_id: userId,
          name: template.name,
          slug: template.slug,
          yaml_config: yamlConfig,
          theme: template.theme,
        });

        if (form) {
          results.push({
            template: template.name,
            status: 'created',
            formId: form.id,
            url: `/demo?formId=${form.id}`,
          });
        } else {
          errors.push({
            template: template.name,
            error: 'Failed to create form in database',
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
      message: 'Template seeding complete',
      userId,
      results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: templates.length,
        created: results.filter(r => r.status === 'created').length,
        already_existed: results.filter(r => r.status === 'already_exists').length,
        failed: errors.length,
      },
    });

  } catch (error: any) {
    console.error('Error seeding templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed templates',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
