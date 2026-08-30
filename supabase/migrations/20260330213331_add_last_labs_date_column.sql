/*
  # Add last labs date field

  1. Changes
    - Add `last_labs_date` text column to store when bloodwork was last done

  2. Notes
    - Field appears when user indicates they have existing bloodwork
    - Captures recency context for lab results
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'last_labs_date'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN last_labs_date text;
  END IF;
END $$;
