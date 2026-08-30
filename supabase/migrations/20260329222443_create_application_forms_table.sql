/*
  # Create Application Forms Table

  1. New Tables
    - `application_forms`
      - `id` (uuid, primary key)
      - `gender` (text) - Male/Female
      - `current_state_goals` (jsonb) - Array of selected goals
      - `body_fat_current` (numeric) - Current body fat %
      - `body_fat_goal` (numeric) - Goal body fat %
      - `symptoms` (jsonb) - Array of symptoms
      - `bloodwork_status` (text) - Yes/No but willing/No not interested
      - `testosterone_level` (text) - Optional, for males who have bloodwork
      - `previous_attempts` (jsonb) - What they've tried before
      - `why_still_looking` (text) - Why they need help
      - `timeline` (text) - ASAP/Within 3 months/No rush
      - `commitment_level` (integer) - 1-10 scale
      - `willing_to` (jsonb) - Array of commitments
      - `consequences` (text) - What happens if they don't fix this
      - `investment_range` (text) - Budget range
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `created_at` (timestamptz) - Submission timestamp
  
  2. Security
    - Enable RLS on `application_forms` table
    - Add policy for anyone to insert their application (public form)
    - No select/update/delete policies (admin only access)
*/

CREATE TABLE IF NOT EXISTS application_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gender text NOT NULL,
  current_state_goals jsonb DEFAULT '[]'::jsonb,
  body_fat_current numeric,
  body_fat_goal numeric,
  symptoms jsonb DEFAULT '[]'::jsonb,
  bloodwork_status text,
  testosterone_level text,
  previous_attempts jsonb DEFAULT '[]'::jsonb,
  why_still_looking text,
  timeline text,
  commitment_level integer,
  willing_to jsonb DEFAULT '[]'::jsonb,
  consequences text,
  investment_range text,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE application_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application form"
  ON application_forms
  FOR INSERT
  TO anon
  WITH CHECK (true);