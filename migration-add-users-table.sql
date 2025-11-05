-- Migration: Add users table for Stripe integration and user management
-- This table tracks paid users, their tier, and lifetime access status

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  clerk_user_id VARCHAR(255) UNIQUE,
  tier VARCHAR(50) DEFAULT 'free',
  lifetime_access BOOLEAN DEFAULT false,
  affiliate_ref VARCHAR(255),
  stripe_session_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);
CREATE INDEX IF NOT EXISTS idx_users_lifetime_access ON users(lifetime_access) WHERE lifetime_access = true;
CREATE INDEX IF NOT EXISTS idx_users_affiliate_ref ON users(affiliate_ref) WHERE affiliate_ref IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- Verify table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
