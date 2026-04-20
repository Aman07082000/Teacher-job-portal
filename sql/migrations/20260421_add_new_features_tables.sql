-- New Features Tables

-- 1. Saved Jobs (Wishlist)
CREATE TABLE IF NOT EXISTS saved_jobs (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  job_id INT NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, job_id)
);

-- 2. Job Alerts
CREATE TABLE IF NOT EXISTS job_alerts (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  subject_expertise VARCHAR(255),
  location VARCHAR(255),
  min_salary INT,
  max_salary INT,
  experience_level VARCHAR(100),
  job_type VARCHAR(100),
  frequency VARCHAR(50) DEFAULT 'weekly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Ratings & Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id INT NOT NULL,
  reviewed_id INT NOT NULL,
  reviewer_role VARCHAR(50),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Followed Schools
CREATE TABLE IF NOT EXISTS followed_schools (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  school_id INT NOT NULL,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, school_id)
);

-- 5. Profile Strength
CREATE TABLE IF NOT EXISTS profile_strength (
  teacher_id INT PRIMARY KEY,
  strength_percentage INT DEFAULT 0,
  has_photo BOOLEAN DEFAULT false,
  has_resume BOOLEAN DEFAULT false,
  has_bio BOOLEAN DEFAULT false,
  has_experience_years BOOLEAN DEFAULT false,
  has_certifications BOOLEAN DEFAULT false,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Job Match Scores (for caching)
CREATE TABLE IF NOT EXISTS job_match_scores (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  job_id INT NOT NULL,
  match_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, job_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_jobs_teacher ON saved_jobs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_teacher ON job_alerts(teacher_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_followed_schools_teacher ON followed_schools(teacher_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_teacher ON job_match_scores(teacher_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_job ON job_match_scores(job_id);
