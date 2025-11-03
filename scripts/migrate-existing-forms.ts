/**
 * Migration Script: Import Existing Forms to Database
 * 
 * This script imports your existing early-access-v1.yaml into the database
 * Run this once after setting up Vercel Postgres
 * 
 * Usage:
 * 1. Set up Vercel Postgres and run schema.sql
 * 2. Run: npx tsx scripts/migrate-existing-forms.ts
 */

import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('🚀 Starting migration...');

  try {
    // Read the existing YAML file
    const yamlPath = path.join(process.cwd(), 'flows', 'early-access-v1.yaml');
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

    console.log('📄 Found early-access-v1.yaml');

    // Insert into database
    const result = await sql`
      INSERT INTO forms (id, name, slug, yaml_config, is_active)
      VALUES (
        'early-access-v1',
        'Formversation • Early Access Voice Intake',
        'early-access',
        ${yamlContent},
        true
      )
      ON CONFLICT (id) DO UPDATE
      SET 
        yaml_config = ${yamlContent},
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, name
    `;

    console.log('✅ Migrated form:', result.rows[0]);
    console.log('🎉 Migration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit /forms to see your forms');
    console.log('2. Test the form at /demo?formId=early-access-v1');
    console.log('3. Create new forms at /forms/create');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
