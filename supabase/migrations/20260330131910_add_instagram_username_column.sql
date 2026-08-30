/*
  # Add Instagram Username Column

  1. Changes
    - Add `instagram_username` column to `application_forms` table
      - Type: text (nullable)
      - Allows users to optionally provide their Instagram username
  
  2. Notes
    - This is a non-breaking change, existing records will have NULL values
    - Column is optional to maintain backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'instagram_username'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN instagram_username text;
  END IF;
END $$;