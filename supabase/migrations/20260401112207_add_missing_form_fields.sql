/*
  # Add Missing Form Fields
  
  1. Changes
    - Add `other_goal` column for custom goal text
    - Add `other_symptom` column for custom symptom text
    - Add `supplements_used` column for supplements list
  
  2. Security
    - Columns are nullable to maintain data integrity
    - All columns are updatable
*/

DO $$
BEGIN
  -- Add other_goal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'other_goal'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN other_goal text;
  END IF;

  -- Add other_symptom column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'other_symptom'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN other_symptom text;
  END IF;

  -- Add supplements_used column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'supplements_used'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN supplements_used text;
  END IF;
END $$;