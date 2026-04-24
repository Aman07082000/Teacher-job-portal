-- School Features Migration
-- Created: 2026-04-25
-- Description: Add tables for school features including analytics, applicant management, 
-- shortlisting, ratings, interview scheduling, and hiring pipeline

-- Candidate Shortlists Table
CREATE TABLE IF NOT EXISTS candidate_shortlists (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(application_id)
);

-- Interview Schedules Table
CREATE TABLE IF NOT EXISTS interview_schedules (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  interview_date TIMESTAMP NOT NULL,
  interview_type VARCHAR(20) NOT NULL CHECK (interview_type IN ('phone', 'video', 'in_person', 'group')),
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School to Teacher Ratings Table
CREATE TABLE IF NOT EXISTS school_to_teacher_ratings (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(school_id, teacher_id)
);

-- School Analytics Cache Table
CREATE TABLE IF NOT EXISTS school_analytics_cache (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
  total_jobs INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  offers_extended INTEGER DEFAULT 0,
  offers_accepted INTEGER DEFAULT 0,
  hire_rate DECIMAL(5, 2) DEFAULT 0,
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_candidate_shortlists_school_id ON candidate_shortlists(school_id);
CREATE INDEX IF NOT EXISTS idx_candidate_shortlists_application_id ON candidate_shortlists(application_id);
CREATE INDEX IF NOT EXISTS idx_candidate_shortlists_created_at ON candidate_shortlists(created_at);

CREATE INDEX IF NOT EXISTS idx_interview_schedules_school_id ON interview_schedules(school_id);
CREATE INDEX IF NOT EXISTS idx_interview_schedules_application_id ON interview_schedules(application_id);
CREATE INDEX IF NOT EXISTS idx_interview_schedules_date ON interview_schedules(interview_date);
CREATE INDEX IF NOT EXISTS idx_interview_schedules_completed ON interview_schedules(completed);

CREATE INDEX IF NOT EXISTS idx_school_to_teacher_ratings_school_id ON school_to_teacher_ratings(school_id);
CREATE INDEX IF NOT EXISTS idx_school_to_teacher_ratings_teacher_id ON school_to_teacher_ratings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_school_to_teacher_ratings_rating ON school_to_teacher_ratings(rating);

CREATE INDEX IF NOT EXISTS idx_school_analytics_cache_school_id ON school_analytics_cache(school_id);
CREATE INDEX IF NOT EXISTS idx_school_analytics_cache_updated_at ON school_analytics_cache(updated_at);

-- Add columns to applications table for tracking if needed (status column already exists)
-- These allow better tracking through the hiring pipeline

-- Add function to update school analytics cache (optional - for future use with triggers)
CREATE OR REPLACE FUNCTION update_school_analytics_cache()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE school_analytics_cache 
  SET updated_at = CURRENT_TIMESTAMP 
  WHERE school_id = NEW.school_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic cache updates (optional)
CREATE TRIGGER trg_update_analytics_on_application_change
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW WHEN (NEW.job_id IN (SELECT id FROM jobs WHERE school_id IS NOT NULL))
EXECUTE FUNCTION update_school_analytics_cache();

CREATE TRIGGER trg_update_analytics_on_shortlist_change
AFTER INSERT OR DELETE ON candidate_shortlists
FOR EACH ROW
EXECUTE FUNCTION update_school_analytics_cache();

CREATE TRIGGER trg_update_analytics_on_interview_change
AFTER INSERT OR UPDATE ON interview_schedules
FOR EACH ROW
EXECUTE FUNCTION update_school_analytics_cache();
