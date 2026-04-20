import pool from '../config/db.js';

export const getAdminAnalytics = async () => {
  const totals = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS users_count,
      (SELECT COUNT(*) FROM jobs) AS jobs_count,
      (SELECT COUNT(*) FROM applications) AS applications_count,
      (SELECT COUNT(*) FROM applications WHERE status = 'shortlisted') AS shortlisted_count
  `);
  return totals.rows[0];
};

export const createNotification = async (userId, message) => {
  const result = await pool.query(
    'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
    [userId, message]
  );
  return result.rows[0];
};
