/*
  # Add Lifestyle and Medical Questions to Application Forms

  1. Changes
    - Remove old timeline, commitment_level, and willing_to columns
    - Add new lifestyle and medical assessment columns:
      - `hours_per_week` (text) - Time commitment availability
      - `current_training_program` (text) - Existing training details
      - `medical_conditions` (text) - Diagnosed conditions and medications
      - `stress_sleep_situation` (text) - Lifestyle context assessment
  
  2. Purpose
    - Captures lifestyle constraints for realistic planning
    - Documents medical history for legal protection and safety
    - Identifies root causes through stress/sleep assessment
    - Replaces generic commitment metrics with specific actionable data
*/

-- Remove old timeline/commitment fields
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'timeline'
  ) THEN
    ALTER TABLE application_forms DROP COLUMN timeline;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'commitment_level'
  ) THEN
    ALTER TABLE application_forms DROP COLUMN commitment_level;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'willing_to'
  ) THEN
    ALTER TABLE application_forms DROP COLUMN willing_to;
  END IF;
END $$;

-- Add new lifestyle and medical assessment columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'hours_per_week'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN hours_per_week text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'current_training_program'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN current_training_program text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'medical_conditions'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN medical_conditions text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'application_forms' AND column_name = 'stress_sleep_situation'
  ) THEN
    ALTER TABLE application_forms ADD COLUMN stress_sleep_situation text;
  END IF;
END $$;