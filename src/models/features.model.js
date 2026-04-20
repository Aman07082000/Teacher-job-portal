import pool from '../config/db.js';

// ============ SAVED JOBS MODEL ============
export const saveJob = async (teacherId, jobId) => {
  const query = `
    INSERT INTO saved_jobs (teacher_id, job_id)
    VALUES ($1, $2)
    ON CONFLICT (teacher_id, job_id) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, jobId]);
  return result.rows[0];
};

export const removeSavedJob = async (teacherId, jobId) => {
  const query = `DELETE FROM saved_jobs WHERE teacher_id = $1 AND job_id = $2;`;
  await pool.query(query, [teacherId, jobId]);
};

export const getSavedJobs = async (teacherId) => {
  const query = `
    SELECT j.*, s.saved_at
    FROM saved_jobs s
    JOIN jobs j ON s.job_id = j.id
    WHERE s.teacher_id = $1
    ORDER BY s.saved_at DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows;
};

export const isSavedJob = async (teacherId, jobId) => {
  const query = `
    SELECT 1 FROM saved_jobs 
    WHERE teacher_id = $1 AND job_id = $2;
  `;
  const result = await pool.query(query, [teacherId, jobId]);
  return result.rows.length > 0;
};

export const getSavedJobsCount = async (teacherId) => {
  const query = `SELECT COUNT(*) FROM saved_jobs WHERE teacher_id = $1;`;
  const result = await pool.query(query, [teacherId]);
  return parseInt(result.rows[0].count);
};

// ============ JOB ALERTS MODEL ============
export const createJobAlert = async (teacherId, alert) => {
  const { subject_expertise, location, min_salary, max_salary, experience_level, job_type, frequency } = alert;
  const query = `
    INSERT INTO job_alerts (teacher_id, subject_expertise, location, min_salary, max_salary, experience_level, job_type, frequency)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    teacherId,
    subject_expertise,
    location,
    min_salary,
    max_salary,
    experience_level,
    job_type,
    frequency,
  ]);
  return result.rows[0];
};

export const getJobAlerts = async (teacherId) => {
  const query = `
    SELECT * FROM job_alerts 
    WHERE teacher_id = $1 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows;
};

export const updateJobAlert = async (alertId, alert) => {
  const { subject_expertise, location, min_salary, max_salary, experience_level, job_type, frequency, is_active } = alert;
  const query = `
    UPDATE job_alerts 
    SET subject_expertise = $1, location = $2, min_salary = $3, max_salary = $4, 
        experience_level = $5, job_type = $6, frequency = $7, is_active = $8, updated_at = NOW()
    WHERE id = $9
    RETURNING *;
  `;
  const result = await pool.query(query, [
    subject_expertise,
    location,
    min_salary,
    max_salary,
    experience_level,
    job_type,
    frequency,
    is_active,
    alertId,
  ]);
  return result.rows[0];
};

export const deleteJobAlert = async (alertId) => {
  const query = `DELETE FROM job_alerts WHERE id = $1;`;
  await pool.query(query, [alertId]);
};

// ============ RATINGS & REVIEWS MODEL ============
export const createReview = async (reviewData) => {
  const { reviewer_id, reviewed_id, reviewer_role, rating, review_text, category } = reviewData;
  const query = `
    INSERT INTO reviews (reviewer_id, reviewed_id, reviewer_role, rating, review_text, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const result = await pool.query(query, [reviewer_id, reviewed_id, reviewer_role, rating, review_text, category]);
  return result.rows[0];
};

export const getReviews = async (userId) => {
  const query = `
    SELECT r.*, u.name as reviewer_name, u.role as reviewer_role_type
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewed_id = $1
    ORDER BY r.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getReviewStats = async (userId) => {
  const query = `
    SELECT 
      COUNT(*) as total_reviews,
      AVG(rating)::NUMERIC(3,2) as average_rating,
      MAX(rating) as highest_rating,
      MIN(rating) as lowest_rating
    FROM reviews
    WHERE reviewed_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

export const updateReview = async (reviewId, reviewData) => {
  const { rating, review_text } = reviewData;
  const query = `
    UPDATE reviews 
    SET rating = $1, review_text = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [rating, review_text, reviewId]);
  return result.rows[0];
};

export const deleteReview = async (reviewId) => {
  const query = `DELETE FROM reviews WHERE id = $1;`;
  await pool.query(query, [reviewId]);
};

// ============ FOLLOWED SCHOOLS MODEL ============
export const followSchool = async (teacherId, schoolId) => {
  const query = `
    INSERT INTO followed_schools (teacher_id, school_id)
    VALUES ($1, $2)
    ON CONFLICT (teacher_id, school_id) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, schoolId]);
  return result.rows[0];
};

export const unfollowSchool = async (teacherId, schoolId) => {
  const query = `DELETE FROM followed_schools WHERE teacher_id = $1 AND school_id = $2;`;
  await pool.query(query, [teacherId, schoolId]);
};

export const getFollowedSchools = async (teacherId) => {
  const query = `
    SELECT u.*, fs.followed_at
    FROM followed_schools fs
    JOIN users u ON fs.school_id = u.id
    WHERE fs.teacher_id = $1 AND u.role = 'school'
    ORDER BY fs.followed_at DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows;
};

export const isFollowingSchool = async (teacherId, schoolId) => {
  const query = `
    SELECT 1 FROM followed_schools 
    WHERE teacher_id = $1 AND school_id = $2;
  `;
  const result = await pool.query(query, [teacherId, schoolId]);
  return result.rows.length > 0;
};

export const getFollowersCount = async (schoolId) => {
  const query = `SELECT COUNT(*) FROM followed_schools WHERE school_id = $1;`;
  const result = await pool.query(query, [schoolId]);
  return parseInt(result.rows[0].count);
};

// ============ PROFILE STRENGTH MODEL ============
export const initializeProfileStrength = async (teacherId) => {
  const query = `
    INSERT INTO profile_strength (teacher_id)
    VALUES ($1)
    ON CONFLICT (teacher_id) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows[0];
};

export const updateProfileStrength = async (teacherId, strengthData) => {
  const query = `
    UPDATE profile_strength 
    SET strength_percentage = $1, has_photo = $2, has_resume = $3, 
        has_bio = $4, has_experience_years = $5, has_certifications = $6,
        last_updated = NOW()
    WHERE teacher_id = $7
    RETURNING *;
  `;
  const result = await pool.query(query, [
    strengthData.strength_percentage,
    strengthData.has_photo,
    strengthData.has_resume,
    strengthData.has_bio,
    strengthData.has_experience_years,
    strengthData.has_certifications,
    teacherId,
  ]);
  return result.rows[0];
};

export const getProfileStrength = async (teacherId) => {
  const query = `SELECT * FROM profile_strength WHERE teacher_id = $1;`;
  const result = await pool.query(query, [teacherId]);
  return result.rows[0];
};

export const calculateProfileStrength = async (teacherId) => {
  const query = `
    SELECT u.*, ps.has_photo, ps.has_resume, ps.has_bio, ps.has_experience_years, ps.has_certifications
    FROM users u
    LEFT JOIN profile_strength ps ON u.id = ps.teacher_id
    WHERE u.id = $1;
  `;
  const result = await pool.query(query, [teacherId]);
  
  if (result.rows.length === 0) return 0;
  
  const user = result.rows[0];
  let strength = 0;
  
  if (user.name) strength += 15;
  if (user.email) strength += 15;
  if (user.has_photo) strength += 20;
  if (user.has_resume) strength += 15;
  if (user.has_bio) strength += 15;
  if (user.has_experience_years) strength += 10;
  if (user.has_certifications) strength += 10;
  
  return Math.min(strength, 100);
};

// ============ JOB MATCH SCORE MODEL ============
export const calculateJobMatchScore = async (teacherId, jobId) => {
  const query = `
    SELECT u.*, j.*, ps.*
    FROM users u
    LEFT JOIN jobs j ON j.id = $2
    LEFT JOIN profile_strength ps ON u.id = ps.teacher_id
    WHERE u.id = $1 AND u.role = 'teacher';
  `;
  const result = await pool.query(query, [teacherId, jobId]);
  
  if (result.rows.length === 0) return 0;
  
  const user = result.rows[0];
  const job = result.rows[0];
  
  let score = 0;
  
  // Subject expertise match (40 points)
  if (user.subject_expertise && job.subject_expertise) {
    if (user.subject_expertise.toLowerCase() === job.subject_expertise.toLowerCase()) {
      score += 40;
    } else if (user.subject_expertise.toLowerCase().includes(job.subject_expertise.toLowerCase())) {
      score += 25;
    }
  }
  
  // Location match (30 points)
  if (user.location && job.location) {
    if (user.location.toLowerCase() === job.location.toLowerCase()) {
      score += 30;
    } else if (user.location.toLowerCase().includes(job.location.toLowerCase()) ||
               job.location.toLowerCase().includes(user.location.toLowerCase())) {
      score += 15;
    }
  }
  
  // Experience match (20 points)
  if (user.experience_years && job.experience_required) {
    if (user.experience_years >= job.experience_required) {
      score += 20;
    } else if (user.experience_years >= job.experience_required - 1) {
      score += 10;
    }
  }
  
  // Profile completion bonus (10 points)
  if (user.strength_percentage && user.strength_percentage >= 80) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

export const saveMatchScore = async (teacherId, jobId, score) => {
  const query = `
    INSERT INTO job_match_scores (teacher_id, job_id, match_score)
    VALUES ($1, $2, $3)
    ON CONFLICT (teacher_id, job_id) DO UPDATE SET match_score = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, jobId, score]);
  return result.rows[0];
};

export const getMatchScore = async (teacherId, jobId) => {
  const query = `SELECT match_score FROM job_match_scores WHERE teacher_id = $1 AND job_id = $2;`;
  const result = await pool.query(query, [teacherId, jobId]);
  return result.rows[0]?.match_score || 0;
};

// ============ STATISTICS MODEL ============
export const getTeacherStats = async (teacherId) => {
  const applicationsQuery = `SELECT COUNT(*) FROM applications WHERE teacher_id = $1;`;
  const savedJobsQuery = `SELECT COUNT(*) FROM saved_jobs WHERE teacher_id = $1;`;
  const followedQuery = `SELECT COUNT(*) FROM followed_schools WHERE teacher_id = $1;`;
  
  const applications = await pool.query(applicationsQuery, [teacherId]);
  const savedJobs = await pool.query(savedJobsQuery, [teacherId]);
  const followed = await pool.query(followedQuery, [teacherId]);
  
  return {
    total_applications: parseInt(applications.rows[0].count),
    total_saved_jobs: parseInt(savedJobs.rows[0].count),
    total_followed_schools: parseInt(followed.rows[0].count),
  };
};
