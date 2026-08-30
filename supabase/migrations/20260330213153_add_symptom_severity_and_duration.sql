/*
  # Add symptom severity tracking

  1. Changes
    - Add `symptom_severities` jsonb column to store symptom name and severity (1-5) pairs
    - Add `symptom_duration` text column to store how long symptoms have been experienced
    - Remove old `symptoms` text array column (if exists)

  2. Notes
    - Using jsonb for flexible storage of symptom/severity pairs
    - Severity scale: 1 = mild, 5 = debilitating
    - Duration field captures time context for symptoms
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'symptom_severities'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN symptom_severities jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'symptom_duration'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN symptom_duration text;
  END IF;
END $$;
