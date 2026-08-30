/*
  # Add body composition fields

  1. Changes
    - Add `current_weight` text column to store weight in lbs
    - Add `height` text column to store height in any format
    - Add `age` text column to store age
    - Add `body_fat_duration` text column to store how long at current body fat

  2. Notes
    - Using conditional checks to prevent errors if columns already exist
    - These fields capture additional body composition metrics for coaching assessment
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'current_weight'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN current_weight text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'height'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN height text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'age'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN age text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'body_fat_duration'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN body_fat_duration text;
  END IF;
END $$;
