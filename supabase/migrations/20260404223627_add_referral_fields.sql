/*
  # Add Referral Fields to Application Forms

  1. Changes
    - Add `was_referred` column (boolean) to track if applicant was referred
    - Add `referred_by` column (text) to store the name of the person who referred them
  
  2. Notes
    - Using `IF NOT EXISTS` to ensure safe migration
    - Fields are optional (nullable)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'was_referred'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN was_referred boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'referred_by'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN referred_by text;
  END IF;
END $$;
