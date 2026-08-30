/*
  # Add full_name column to application_forms

  1. Changes
    - Adds `full_name` (text) column to `application_forms` table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN full_name text;
  END IF;
END $$;
