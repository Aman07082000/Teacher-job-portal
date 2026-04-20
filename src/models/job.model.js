import pool from '../config/db.js';

export const findJobs = async (limit = 50, offset = 0) => {
  const result = await pool.query(
    'SELECT id, title, description, location, subject_expertise, salary_range, posted_at FROM jobs WHERE is_active = true ORDER BY posted_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

export const getAllJobs = async (limit = 50, offset = 0) => {
  const result = await pool.query(
    'SELECT id, title, description, location, subject_expertise, salary_range, posted_at, is_active FROM jobs ORDER BY posted_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

export const getJobById = async (jobId) => {
  const result = await pool.query(
    'SELECT id, school_id, title, description, location, subject_expertise, salary_range, is_active, posted_at FROM jobs WHERE id = $1 LIMIT 1',
    [jobId]
  );
  return result.rows[0];
};

export const searchJobsWithFilters = async (filters) => {
  const conditions = ['is_active = true'];
  const values = [];

  if (filters.title) {
    values.push(`%${filters.title}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`location ILIKE $${values.length}`);
  }
  if (filters.subject) {
    values.push(`%${filters.subject}%`);
    conditions.push(`subject_expertise ILIKE $${values.length}`);
  }

  // Add pagination
  values.push(50); // LIMIT
  values.push(0);  // OFFSET
  
  const sql = `SELECT id, title, description, location, subject_expertise, salary_range, posted_at 
               FROM jobs WHERE ${conditions.join(' AND ')} 
               ORDER BY posted_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;
  const result = await pool.query(sql, values);
  return result.rows;
};

export const createJob = async (schoolId, job) => {
  const sql = 'INSERT INTO jobs (school_id, title, description, location, subject_expertise, salary_range, is_active) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *';
  const values = [schoolId, job.title, job.description, job.location, job.subject_expertise, job.salary_range];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const updateJob = async (jobId, updates) => {
  const allowedFields = ['title', 'description', 'location', 'subject_expertise', 'salary_range', 'status', 'is_active'];
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return await getJobById(jobId);
  }

  values.push(jobId);
  const sql = `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, school_id, title, description, location, subject_expertise, salary_range, is_active, posted_at`;
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const deleteJob = async (jobId) => {
  const sql = 'DELETE FROM jobs WHERE id = $1';
  await pool.query(sql, [jobId]);
};

export const findApplicantsForSchool = async (schoolId) => {
  const sql = `SELECT a.id, a.status, a.cover_letter, a.applied_at, u.name AS teacher_name, j.title AS job_title
               FROM applications a
               JOIN users u ON a.teacher_id = u.id
               JOIN jobs j ON a.job_id = j.id
               WHERE j.school_id = $1
               ORDER BY a.applied_at DESC`;
  const result = await pool.query(sql, [schoolId]);
  return result.rows;
};
