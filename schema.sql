-- VoiceAIForms v1.1 MVP Schema
-- For Vercel Postgres

-- Forms table: stores YAML configurations
CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  yaml_config TEXT NOT NULL,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table: stores form responses
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  metadata JSONB,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);

-- Insert the existing early-access form as first entry
-- This will be updated via migration script
