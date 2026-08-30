/*
  # Add most important goal column

  1. Changes
    - Add `most_important_goal` text column to `application_forms` table
    - This field captures the user's personal explanation of their most important goal

  2. Notes
    - Using conditional check to prevent errors if column already exists
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'most_important_goal'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN most_important_goal text;
  END IF;
END $$;
