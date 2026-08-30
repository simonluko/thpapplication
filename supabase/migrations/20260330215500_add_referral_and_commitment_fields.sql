/*
  # Add Referral Source and Commitment Level Fields

  1. Changes
    - Add `how_found_us` column to store how the applicant discovered the program
    - Add `commitment_level` column to store applicant's self-assessed commitment (1-10 scale)
  
  2. Details
    - `how_found_us` is text field for free-form response
    - `commitment_level` is integer between 1-10
    - Both fields are optional to maintain backward compatibility with existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'how_found_us'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN how_found_us text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'commitment_level'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN commitment_level integer;
  END IF;
END $$;