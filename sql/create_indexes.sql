-- Create indexes for better query performance
-- This significantly speeds up frequently used queries

-- User email index (used in findUserByEmail)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- User role index (for filtering by role)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Job active status index (most queries filter by is_active)
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);

-- Job posted_at index (for sorting by date)
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);

-- Job search indexes
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_subject ON jobs(subject_expertise);

-- Application indexes
CREATE INDEX IF NOT EXISTS idx_applications_teacher_id ON applications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);

-- Teacher profile index
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_user_id ON teacher_profiles(user_id);

-- School profile index
CREATE INDEX IF NOT EXISTS idx_school_profiles_user_id ON school_profiles(user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
