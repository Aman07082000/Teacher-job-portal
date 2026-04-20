-- Users and roles
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'school', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teacher profile data
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  subject_expertise TEXT,
  experience_years INTEGER,
  location TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- School profile data
CREATE TABLE IF NOT EXISTS school_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  school_name TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job postings
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  subject_expertise TEXT,
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  posted_at TIMESTAMP DEFAULT NOW()
);

-- Applications from teachers to jobs
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted',
  applied_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
