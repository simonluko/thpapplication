/*
  # Add three-part reflection questions for what user tried

  1. Changes
    - Add `what_tried` text column for "What did you try?"
    - Add `how_long_stuck` text column for "How long did you stick to it?"
    - Add `why_stopped_working` text column for "Why did it stop working?"

  2. Notes
    - Three-part answer forces deeper reflection
    - Helps understand user's history and patterns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'what_tried'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN what_tried text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'how_long_stuck'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN how_long_stuck text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'why_stopped_working'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN why_stopped_working text;
  END IF;
END $$;
