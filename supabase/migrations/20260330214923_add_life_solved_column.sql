/*
  # Add life_solved column to application_forms

  1. Changes
    - Add `life_solved` column to `application_forms` table
      - Type: text
      - Nullable: true (optional field)
      - Description: Stores user's vision of what their life would look like in 12 months if their problem was completely solved
  
  2. Notes
    - This field captures the positive vision to complement the consequences field
    - Added as part of step 9 questions in the application form
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'life_solved'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN life_solved text;
  END IF;
END $$;