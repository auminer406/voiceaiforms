-- Migration: Add user_id and theme columns to forms table
-- This links forms to Clerk users and adds theme support

-- Add user_id column (nullable initially for existing data)
ALTER TABLE forms
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add theme column with default
ALTER TABLE forms
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);

-- Create composite index for user_id + is_active (common query pattern)
CREATE INDEX IF NOT EXISTS idx_forms_user_active ON forms(user_id, is_active) WHERE is_active = true;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'forms'
ORDER BY ordinal_position;
