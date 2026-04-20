import pool from '../config/db.js';

export const createApplication = async (teacherId, jobId, coverLetter, resumeUrl, experienceYears) => {
  const sql = `INSERT INTO applications (teacher_id, job_id, cover_letter, resume_url, experience_years, status)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [teacherId, jobId, coverLetter || null, resumeUrl || null, experienceYears || null, 'submitted'];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const findApplicationsByTeacher = async (teacherId) => {
  const sql = `SELECT a.id, a.status, a.cover_letter, a.applied_at, j.title AS job_title, s.school_name
               FROM applications a
               JOIN jobs j ON a.job_id = j.id
               JOIN school_profiles s ON j.school_id = s.user_id
               WHERE a.teacher_id = $1
               ORDER BY a.applied_at DESC`;
  const result = await pool.query(sql, [teacherId]);
  return result.rows;
};

export const shortlistApplication = async (applicationId) => {
  const sql = 'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(sql, ['shortlisted', applicationId]);
  return result.rows[0];
};
