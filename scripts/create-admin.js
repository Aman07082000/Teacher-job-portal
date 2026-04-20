import pool from '../src/config/db.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@teacherportal.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 8);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      ['Admin User', 'admin@teacherportal.com', hashedPassword, 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@teacherportal.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    pool.end();
  }
}

createAdminUser();