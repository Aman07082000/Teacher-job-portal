#!/usr/bin/env node

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@teacherportal.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function getAdminToken() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Failed to get admin token:', error.response?.data?.error || error.message);
    console.log('💡 Make sure admin user exists. Run: npm run create-admin');
    process.exit(1);
  }
}

async function seedJobs(token) {
  try {
    console.log('🚀 Starting job seeding via API...');

    const response = await axios.post(`${API_URL}/jobs/seed`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 60000 // 60 second timeout
    });

    console.log('✅ Job seeding completed!');
    console.log(`📊 Results: ${response.data.jobsCreated} jobs, ${response.data.schoolsCreated} schools`);

  } catch (error) {
    console.error('❌ Failed to seed jobs:', error.response?.data?.error || error.message);
    process.exit(1);
  }
}

async function clearJobs(token) {
  try {
    console.log('🧹 Starting data clearing via API...');

    const response = await axios.delete(`${API_URL}/jobs/clear`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    console.log('✅ Data clearing completed!');
    console.log(`📊 Results: ${response.data.recordsDeleted} records deleted`);

  } catch (error) {
    console.error('❌ Failed to clear jobs:', error.response?.data?.error || error.message);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  // Check if backend is running
  try {
    await axios.get(`${API_URL}/jobs`, { timeout: 5000 });
  } catch (error) {
    console.error('❌ Backend server not running or not accessible');
    console.log('💡 Start the backend server first: npm run dev');
    process.exit(1);
  }

  try {
    if (command === 'seed') {
      const token = await getAdminToken();
      await seedJobs(token);
    } else if (command === 'clear') {
      const token = await getAdminToken();
      await clearJobs(token);
    } else {
      console.log('Usage:');
      console.log('  node scripts/seed-jobs.js seed    # Seed jobs from multiple platforms');
      console.log('  node scripts/seed-jobs.js clear   # Clear all jobs and school data');
      console.log('');
      console.log('Prerequisites:');
      console.log('  1. Backend server running: npm run dev');
      console.log('  2. Admin user exists: npm run create-admin');
      console.log('');
      console.log('API Endpoints (Admin only):');
      console.log('  POST /api/jobs/seed   # Seed jobs');
      console.log('  DELETE /api/jobs/clear # Clear jobs');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();