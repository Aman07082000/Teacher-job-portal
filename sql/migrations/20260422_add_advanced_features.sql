-- Advanced Features Tables (Part 2)

-- 1. Teacher Analytics
CREATE TABLE IF NOT EXISTS teacher_analytics (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL UNIQUE,
  profile_views INT DEFAULT 0,
  applications_sent INT DEFAULT 0,
  interviews_scheduled INT DEFAULT 0,
  offers_received INT DEFAULT 0,
  profile_completion_percentage INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Skill Endorsements
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  endorsed_by INT NOT NULL,
  skill VARCHAR(255),
  endorsement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (endorsed_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, endorsed_by, skill)
);

-- 3. Interview Experiences
CREATE TABLE IF NOT EXISTS interview_experiences (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  school_id INT,
  job_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  experience_type VARCHAR(50), -- 'phone', 'video', 'in-person', 'group'
  difficulty_level VARCHAR(50), -- 'easy', 'medium', 'hard'
  experience_description TEXT,
  questions_asked TEXT,
  tips_for_candidates TEXT,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  helpful_count INT DEFAULT 0,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 4. Application Timeline
CREATE TABLE IF NOT EXISTS application_timeline (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL,
  status VARCHAR(50), -- 'applied', 'viewed', 'shortlisted', 'rejected', 'interview_scheduled', 'offer_extended'
  status_change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- 5. Live Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type VARCHAR(50), -- 'job_match', 'company_post', 'interview_scheduled', 'offer', 'message'
  title VARCHAR(255),
  description TEXT,
  related_job_id INT,
  related_school_id INT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  FOREIGN KEY (related_school_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Interview Preparation Resources
CREATE TABLE IF NOT EXISTS interview_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  content TEXT,
  resource_type VARCHAR(50), -- 'tip', 'guide', 'video', 'article'
  subject_expertise VARCHAR(255),
  difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  view_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Resume Templates
CREATE TABLE IF NOT EXISTS resume_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  structure JSONB, -- JSON structure of resume sections
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Teacher Resumes
CREATE TABLE IF NOT EXISTS teacher_resumes (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  template_id INT,
  title VARCHAR(255),
  content JSONB, -- JSON structure with all resume data
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES resume_templates(id) ON DELETE SET NULL
);

-- 9. Two-Way Ratings
CREATE TABLE IF NOT EXISTS two_way_ratings (
  id SERIAL PRIMARY KEY,
  rater_id INT NOT NULL,
  rated_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  rating_type VARCHAR(50), -- 'teacher', 'school'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (rated_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(rater_id, rated_id)
);

-- 10. Premium Features
CREATE TABLE IF NOT EXISTS premium_features (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL UNIQUE,
  tier VARCHAR(50), -- 'basic', 'premium', 'pro'
  resume_priority BOOLEAN DEFAULT false,
  profile_visibility BOOLEAN DEFAULT false,
  profile_badge BOOLEAN DEFAULT false,
  direct_message_limit INT DEFAULT 5,
  unlimited_applications BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_teacher_analytics_teacher ON teacher_analytics(teacher_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_teacher ON skill_endorsements(teacher_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_endorsed_by ON skill_endorsements(endorsed_by);
CREATE INDEX IF NOT EXISTS idx_interview_experiences_teacher ON interview_experiences(teacher_id);
CREATE INDEX IF NOT EXISTS idx_interview_experiences_school ON interview_experiences(school_id);
CREATE INDEX IF NOT EXISTS idx_application_timeline_application ON application_timeline(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_interview_resources_subject ON interview_resources(subject_expertise);
CREATE INDEX IF NOT EXISTS idx_teacher_resumes_teacher ON teacher_resumes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_two_way_ratings_rater ON two_way_ratings(rater_id);
CREATE INDEX IF NOT EXISTS idx_two_way_ratings_rated ON two_way_ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_premium_features_teacher ON premium_features(teacher_id);
