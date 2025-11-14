-- Migration: Add generate_invoice flag to forms table
-- This allows users to control which forms trigger invoice generation

ALTER TABLE forms
ADD COLUMN IF NOT EXISTS generate_invoice BOOLEAN DEFAULT false;

-- Create index for forms that generate invoices (common query pattern)
CREATE INDEX IF NOT EXISTS idx_forms_generate_invoice ON forms(generate_invoice) WHERE generate_invoice = true;

-- Verify column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'forms'
ORDER BY ordinal_position;
