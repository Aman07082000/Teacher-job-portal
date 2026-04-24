import pool from '../config/db.js';

// ============ TEACHER ANALYTICS ============
export const getOrCreateAnalytics = async (teacherId) => {
  const query = `
    INSERT INTO teacher_analytics (teacher_id)
    VALUES ($1)
    ON CONFLICT (teacher_id) DO UPDATE
    SET last_updated = NOW()
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows[0];
};

export const getTeacherAnalytics = async (teacherId) => {
  const query = `
    SELECT * FROM teacher_analytics 
    WHERE teacher_id = $1;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows[0];
};

export const updateAnalytics = async (teacherId, updates) => {
  const { profile_views, applications_sent, interviews_scheduled, offers_received } = updates;
  const query = `
    UPDATE teacher_analytics 
    SET 
      profile_views = COALESCE(profile_views, 0) + COALESCE($2, 0),
      applications_sent = COALESCE(applications_sent, 0) + COALESCE($3, 0),
      interviews_scheduled = COALESCE(interviews_scheduled, 0) + COALESCE($4, 0),
      offers_received = COALESCE(offers_received, 0) + COALESCE($5, 0),
      last_updated = NOW()
    WHERE teacher_id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [
    teacherId,
    profile_views || 0,
    applications_sent || 0,
    interviews_scheduled || 0,
    offers_received || 0
  ]);
  return result.rows[0];
};

// ============ SKILL ENDORSEMENTS ============
export const endorseSkill = async (teacherId, endorsedBy, skill) => {
  const query = `
    INSERT INTO skill_endorsements (teacher_id, endorsed_by, skill)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, endorsedBy, skill]);
  return result.rows[0];
};

export const getSkillEndorsements = async (teacherId) => {
  const query = `
    SELECT skill, COUNT(*) as endorsement_count, 
           MAX(endorsement_date) as latest_endorsement
    FROM skill_endorsements 
    WHERE teacher_id = $1
    GROUP BY skill
    ORDER BY endorsement_count DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows;
};

export const removeSkillEndorsement = async (teacherId, endorsedBy, skill) => {
  const query = `
    DELETE FROM skill_endorsements 
    WHERE teacher_id = $1 AND endorsed_by = $2 AND skill = $3;
  `;
  await pool.query(query, [teacherId, endorsedBy, skill]);
};

// ============ INTERVIEW EXPERIENCES ============
export const shareInterviewExperience = async (experienceData) => {
  const {
    teacher_id,
    school_id,
    job_id,
    rating,
    experience_type,
    difficulty_level,
    experience_description,
    questions_asked,
    tips_for_candidates
  } = experienceData;

  const query = `
    INSERT INTO interview_experiences 
    (teacher_id, school_id, job_id, rating, experience_type, difficulty_level, 
     experience_description, questions_asked, tips_for_candidates)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    teacher_id,
    school_id,
    job_id,
    rating,
    experience_type,
    difficulty_level,
    experience_description,
    questions_asked,
    tips_for_candidates
  ]);

  return result.rows[0];
};

export const getSchoolExperiences = async (schoolId) => {
  const query = `
    SELECT ie.*, u.name as teacher_name
    FROM interview_experiences ie
    JOIN users u ON ie.teacher_id = u.id
    WHERE ie.school_id = $1
    ORDER BY ie.posted_at DESC;
  `;
  const result = await pool.query(query, [schoolId]);
  return result.rows;
};

export const getJobExperiences = async (jobId) => {
  const query = `
    SELECT ie.*, u.name as teacher_name
    FROM interview_experiences ie
    JOIN users u ON ie.teacher_id = u.id
    WHERE ie.job_id = $1
    ORDER BY ie.posted_at DESC
    LIMIT 10;
  `;
  const result = await pool.query(query, [jobId]);
  return result.rows;
};

// ============ APPLICATION TIMELINE ============
export const addApplicationStatus = async (applicationId, status, notes = null) => {
  const query = `
    INSERT INTO application_timeline (application_id, status, notes)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [applicationId, status, notes]);
  return result.rows[0];
};

export const getApplicationTimeline = async (applicationId) => {
  const query = `
    SELECT * FROM application_timeline 
    WHERE application_id = $1
    ORDER BY status_change_date ASC;
  `;
  const result = await pool.query(query, [applicationId]);
  return result.rows;
};

// ============ NOTIFICATIONS ============
export const createNotification = async (notificationData) => {
  const {
    user_id,
    notification_type,
    title,
    description,
    related_job_id,
    related_school_id
  } = notificationData;

  const query = `
    INSERT INTO notifications 
    (user_id, notification_type, title, description, related_job_id, related_school_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    user_id,
    notification_type,
    title,
    description,
    related_job_id,
    related_school_id
  ]);

  return result.rows[0];
};

export const getUnreadNotifications = async (userId, limit = 20) => {
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = $1 AND is_read = false
    ORDER BY created_at DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

export const getAllNotifications = async (userId, limit = 50) => {
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

export const markNotificationAsRead = async (notificationId) => {
  const query = `
    UPDATE notifications 
    SET is_read = true
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [notificationId]);
  return result.rows[0];
};

export const markAllNotificationsAsRead = async (userId) => {
  const query = `
    UPDATE notifications 
    SET is_read = true
    WHERE user_id = $1;
  `;
  await pool.query(query, [userId]);
};

// ============ INTERVIEW RESOURCES ============
export const getInterviewResources = async (subjectExpertise = null, limit = 20) => {
  let query = `
    SELECT * FROM interview_resources 
    WHERE 1=1
  `;
  const params = [];

  if (subjectExpertise) {
    query += ` AND subject_expertise = $${params.length + 1}`;
    params.push(subjectExpertise);
  }

  query += ` ORDER BY rating DESC, view_count DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await pool.query(query, params);
  return result.rows;
};

export const incrementResourceView = async (resourceId) => {
  const query = `
    UPDATE interview_resources 
    SET view_count = view_count + 1
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [resourceId]);
  return result.rows[0];
};

// ============ TWO-WAY RATINGS ============
export const rateUser = async (raterId, ratedId, rating, feedback, ratingType) => {
  const query = `
    INSERT INTO two_way_ratings (rater_id, rated_id, rating, feedback, rating_type)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (rater_id, rated_id) DO UPDATE
    SET rating = $3, feedback = $4, created_at = NOW()
    RETURNING *;
  `;
  const result = await pool.query(query, [raterId, ratedId, rating, feedback, ratingType]);
  return result.rows[0];
};

export const getUserRatings = async (userId) => {
  const query = `
    SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
    FROM two_way_ratings 
    WHERE rated_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

export const getUserReceivedRatings = async (userId, limit = 10) => {
  const query = `
    SELECT tr.*, u.name as rater_name, u.profile_image
    FROM two_way_ratings tr
    JOIN users u ON tr.rater_id = u.id
    WHERE tr.rated_id = $1
    ORDER BY tr.created_at DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

// ============ PREMIUM FEATURES ============
export const getPremiumStatus = async (teacherId) => {
  const query = `
    SELECT * FROM premium_features 
    WHERE teacher_id = $1 AND (expires_at IS NULL OR expires_at > NOW());
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows[0];
};

export const updatePremiumStatus = async (teacherId, tier, duration_days = 30) => {
  const query = `
    INSERT INTO premium_features 
    (teacher_id, tier, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '1 day' * $3)
    ON CONFLICT (teacher_id) DO UPDATE
    SET tier = $2, expires_at = NOW() + INTERVAL '1 day' * $3
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, tier, duration_days]);
  return result.rows[0];
};
