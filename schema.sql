-- VoiceAIForms v1.1 MVP Schema
-- For Vercel Postgres

-- Forms table: stores YAML configurations
CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,  -- Clerk user ID (null for legacy forms)
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  yaml_config TEXT NOT NULL,
  webhook_url TEXT,
  theme TEXT DEFAULT 'dark',
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

-- User profiles table: stores contractor information
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL,  -- Clerk user ID
  email TEXT NOT NULL,  -- Contractor email for receiving invoices
  company_name TEXT,  -- Optional company name for invoice branding
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_user_active ON forms(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Insert the existing early-access form as first entry
-- This will be updated via migration script
