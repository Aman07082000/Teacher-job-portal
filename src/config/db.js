import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'teacher_job_portal',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('PostgreSQL idle client error', err.message);
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.warn('⚠ Database connection issue:', err.message);
  } else {
    console.log('✓ Database connected successfully');
  }
});

export default pool;
