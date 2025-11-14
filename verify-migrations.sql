-- ========================================
-- VERIFICATION QUERIES FOR NEON DATABASE
-- Run these to check if migrations worked
-- ========================================

-- 1. Check if user_profiles table exists
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'user_profiles';
-- Expected: Should show "user_profiles | BASE TABLE"

-- 2. Check user_profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
-- Expected: Should show 6 columns (id, user_id, email, company_name, created_at, updated_at)

-- 3. Check if generate_invoice column exists on forms table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'forms' AND column_name = 'generate_invoice';
-- Expected: Should show "generate_invoice | boolean | YES | false"

-- 4. View all columns on forms table (full structure)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'forms'
ORDER BY ordinal_position;
-- Expected: Should include generate_invoice column

-- 5. Check all indexes on user_profiles
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles';
-- Expected: Should show primary key and idx_user_profiles_user_id

-- 6. Check all indexes on forms table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'forms';
-- Expected: Should include idx_forms_generate_invoice

-- 7. List ALL tables in your database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected: forms, submissions, user_profiles (and possibly users if you have that)

-- 8. Quick record counts
SELECT
  (SELECT COUNT(*) FROM forms) as forms_count,
  (SELECT COUNT(*) FROM submissions) as submissions_count,
  (SELECT COUNT(*) FROM user_profiles) as profiles_count;
-- This shows how many records are in each table
