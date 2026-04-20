import { findJobs, searchJobsWithFilters } from '../models/job.model.js';
import { seedJobsFromPlatforms, clearAllJobs } from '../utils/jobSeeder.js';

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await findJobs();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const searchJobs = async (req, res, next) => {
  try {
    const { title, location, subject } = req.query;
    const filters = {};

    if (title) filters.title = title;
    if (location) filters.location = location;
    if (subject) filters.subject = subject;

    const jobs = await searchJobsWithFilters(filters);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const seedJobs = async (req, res, next) => {
  try {
    const result = await seedJobsFromPlatforms();
    res.json({
      message: 'Jobs seeded successfully from multiple platforms!',
      ...result
    });
  } catch (err) {
    next(err);
  }
};

export const clearJobs = async (req, res, next) => {
  try {
    const result = await clearAllJobs();
    res.json({
      message: 'All jobs and school data cleared successfully!',
      ...result
    });
  } catch (err) {
    next(err);
  }
};
