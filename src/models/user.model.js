import pool from '../config/db.js';

export const createUser = async ({ name, email, password, role }) => {
  const sql = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at';
  const values = [name, email, password, role];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  // Only select necessary fields to reduce data transfer
  const result = await pool.query(
    'SELECT id, name, email, password, role, created_at FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0];
};

export const getAllUsers = async (limit = 100, offset = 0) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

export const updateUser = async (userId, updates) => {
  const allowedFields = ['name', 'email', 'role', 'status'];
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
    return await getUserById(userId);
  }

  values.push(userId);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, role, created_at`;
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const deleteUser = async (userId) => {
  const sql = 'DELETE FROM users WHERE id = $1';
  await pool.query(sql, [userId]);
};

export const createTeacherProfileRecord = async (userId, profile) => {
  const sql = 'INSERT INTO teacher_profiles (user_id, subject_expertise, experience_years, location, summary) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [userId, profile.subject_expertise, profile.experience_years, profile.location, profile.summary];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const createSchoolProfileRecord = async (userId, profile) => {
  const sql = 'INSERT INTO school_profiles (user_id, school_name, address, website, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [userId, profile.school_name, profile.address, profile.website, profile.description];
  const result = await pool.query(sql, values);
  return result.rows[0];
};
