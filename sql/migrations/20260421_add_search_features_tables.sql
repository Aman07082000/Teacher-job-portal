-- Advanced Search Features Tables

-- 1. Search History
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  search_query VARCHAR(255),
  filters JSONB,
  results_count INT,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Saved Search Preferences
CREATE TABLE IF NOT EXISTS saved_searches (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  name VARCHAR(255),
  search_query VARCHAR(255),
  filters JSONB,
  frequency VARCHAR(50) DEFAULT 'weekly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Job Comparison List
CREATE TABLE IF NOT EXISTS job_comparisons (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  job_ids INT[],
  comparison_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Search Analytics (for recommendations)
CREATE TABLE IF NOT EXISTS search_analytics (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL,
  job_id INT,
  action_type VARCHAR(50), -- 'view', 'apply', 'save', 'click', 'hover'
  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 5. Job Browse Categories (pre-computed data)
CREATE TABLE IF NOT EXISTS job_categories (
  id SERIAL PRIMARY KEY,
  subject_expertise VARCHAR(255),
  count INT,
  avg_salary DECIMAL(10,2),
  latest_posting TIMESTAMP,
  trending BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Location Stats
CREATE TABLE IF NOT EXISTS location_stats (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255),
  job_count INT,
  avg_salary DECIMAL(10,2),
  schools_count INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(location)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_search_history_teacher ON search_history(teacher_id);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON search_history(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_searches_teacher ON saved_searches(teacher_id);
CREATE INDEX IF NOT EXISTS idx_job_comparisons_teacher ON job_comparisons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_teacher ON search_analytics(teacher_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_action ON search_analytics(action_type);
CREATE INDEX IF NOT EXISTS idx_job_categories_subject ON job_categories(subject_expertise);
CREATE INDEX IF NOT EXISTS idx_location_stats_name ON location_stats(location);
