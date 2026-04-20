-- Add resume_url and experience_years to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS experience_years INTEGER;