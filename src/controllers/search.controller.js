import * as searchModel from '../models/search.model.js';
import * as jobModel from '../models/job.model.js';
import pool from '../config/db.js';

// ============ SEARCH HISTORY ENDPOINTS ============
export const saveSearch = async (req, res, next) => {
  try {
    const { searchQuery, filters } = req.body;
    const teacherId = req.user.id;

    // Get search results count
    const jobResults = await jobModel.searchJobsWithFilters(filters || {});
    const resultsCount = jobResults?.length || 0;

    const search = await searchModel.saveSearchHistory(teacherId, searchQuery, filters, resultsCount);
    res.status(201).json(search);
  } catch (err) {
    next(err);
  }
};

export const getRecentSearches = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const limit = req.query.limit || 20;
    
    const searches = await searchModel.getSearchHistory(teacherId, limit);
    res.json(searches);
  } catch (err) {
    next(err);
  }
};

export const clearAllSearchHistory = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    await searchModel.clearSearchHistory(teacherId);
    res.json({ message: 'Search history cleared' });
  } catch (err) {
    next(err);
  }
};

export const deleteSearchHistoryItem = async (req, res, next) => {
  try {
    const { searchId } = req.params;
    await searchModel.deleteSearchHistoryItem(searchId);
    res.json({ message: 'Search history item deleted' });
  } catch (err) {
    next(err);
  }
};

// ============ SAVED SEARCHES ENDPOINTS ============
export const createSavedSearch = async (req, res, next) => {
  try {
    const { name, search_query, filters, frequency } = req.body;
    const teacherId = req.user.id;

    const savedSearch = await searchModel.createSavedSearch(teacherId, {
      name,
      search_query,
      filters,
      frequency: frequency || 'weekly'
    });

    res.status(201).json(savedSearch);
  } catch (err) {
    next(err);
  }
};

export const getSavedSearches = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const searches = await searchModel.getSavedSearches(teacherId);
    res.json(searches);
  } catch (err) {
    next(err);
  }
};

export const updateSavedSearch = async (req, res, next) => {
  try {
    const { searchId } = req.params;
    const { name, search_query, filters, frequency, is_active } = req.body;

    const updatedSearch = await searchModel.updateSavedSearch(searchId, {
      name,
      search_query,
      filters,
      frequency,
      is_active
    });

    res.json(updatedSearch);
  } catch (err) {
    next(err);
  }
};

export const deleteSavedSearch = async (req, res, next) => {
  try {
    const { searchId } = req.params;
    await searchModel.deleteSavedSearch(searchId);
    res.json({ message: 'Saved search deleted' });
  } catch (err) {
    next(err);
  }
};

// ============ JOB COMPARISON ENDPOINTS ============
export const createJobComparison = async (req, res, next) => {
  try {
    const { jobIds, comparisonName } = req.body;
    const teacherId = req.user.id;

    const comparison = await searchModel.createComparison(teacherId, jobIds, comparisonName);
    res.status(201).json(comparison);
  } catch (err) {
    next(err);
  }
};

export const getMyComparisons = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const comparisons = await searchModel.getComparisons(teacherId);
    
    // Fetch full job details for each comparison
    const enrichedComparisons = await Promise.all(
      comparisons.map(async (comparison) => {
        const jobs = await Promise.all(
          comparison.job_ids.map(jobId => jobModel.getJobById(jobId))
        );
        return {
          ...comparison,
          jobs: jobs.filter(j => j !== undefined)
        };
      })
    );

    res.json(enrichedComparisons);
  } catch (err) {
    next(err);
  }
};

export const addJobToComparison = async (req, res, next) => {
  try {
    const { comparisonId } = req.params;
    const { jobId } = req.body;

    const updated = await searchModel.addJobToComparison(comparisonId, jobId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeJobFromComparison = async (req, res, next) => {
  try {
    const { comparisonId } = req.params;
    const { jobId } = req.body;

    const updated = await searchModel.removeJobFromComparison(comparisonId, jobId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteJobComparison = async (req, res, next) => {
  try {
    const { comparisonId } = req.params;
    await searchModel.deleteComparison(comparisonId);
    res.json({ message: 'Job comparison deleted' });
  } catch (err) {
    next(err);
  }
};

// ============ ADVANCED SEARCH ENDPOINTS ============
export const advancedSearch = async (req, res, next) => {
  try {
    const {
      title,
      location,
      subject,
      minSalary,
      maxSalary,
      sortBy = 'recent',
      page = 1,
      pageSize = 20
    } = req.query;

    const offset = (page - 1) * pageSize;

    // Build query
    let query = `
      SELECT id, title, description, location, subject_expertise, salary_range, posted_at
      FROM jobs
      WHERE is_active = true
    `;
    const params = [];

    if (title) {
      params.push(`%${title}%`);
      query += ` AND title ILIKE $${params.length}`;
    }
    if (location) {
      params.push(`%${location}%`);
      query += ` AND location ILIKE $${params.length}`;
    }
    if (subject) {
      params.push(`%${subject}%`);
      query += ` AND subject_expertise ILIKE $${params.length}`;
    }

    // Sorting
    if (sortBy === 'salary-high') {
      query += ` ORDER BY salary_range DESC`;
    } else if (sortBy === 'salary-low') {
      query += ` ORDER BY salary_range ASC`;
    } else {
      query += ` ORDER BY posted_at DESC`;
    }

    params.push(pageSize);
    params.push(offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM jobs WHERE is_active = true`;
    const countParams = [];

    if (title) {
      countParams.push(`%${title}%`);
      countQuery += ` AND title ILIKE $${countParams.length}`;
    }
    if (location) {
      countParams.push(`%${location}%`);
      countQuery += ` AND location ILIKE $${countParams.length}`;
    }
    if (subject) {
      countParams.push(`%${subject}%`);
      countQuery += ` AND subject_expertise ILIKE $${countParams.length}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Track search if user is authenticated
    if (req.user) {
      await searchModel.trackSearch(req.user.id, 'search', null);
    }

    res.json({
      jobs: result.rows,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    next(err);
  }
};

// ============ JOB CATEGORIES ENDPOINTS ============
export const getJobCategories = async (req, res, next) => {
  try {
    // Fetch categories from database or generate from jobs
    const query = `
      SELECT subject_expertise as category, COUNT(*) as count, AVG(salary_range) as avg_salary
      FROM jobs
      WHERE is_active = true
      GROUP BY subject_expertise
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getLocationStats = async (req, res, next) => {
  try {
    const query = `
      SELECT location, COUNT(*) as job_count, AVG(salary_range) as avg_salary
      FROM jobs
      WHERE is_active = true
      GROUP BY location
      ORDER BY job_count DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// ============ SEARCH SUGGESTIONS ENDPOINTS ============
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Get suggestions from job titles and locations
    const titleQuery = `
      SELECT DISTINCT title FROM jobs
      WHERE is_active = true AND title ILIKE $1
      LIMIT 5
    `;

    const locationQuery = `
      SELECT DISTINCT location FROM jobs
      WHERE is_active = true AND location ILIKE $1
      LIMIT 5
    `;

    const subjectQuery = `
      SELECT DISTINCT subject_expertise FROM jobs
      WHERE is_active = true AND subject_expertise ILIKE $1
      LIMIT 5
    `;

    const param = `%${query}%`;
    const [titles, locations, subjects] = await Promise.all([
      pool.query(titleQuery, [param]),
      pool.query(locationQuery, [param]),
      pool.query(subjectQuery, [param])
    ]);

    const suggestions = [
      ...titles.rows.map(r => ({ type: 'title', text: r.title })),
      ...locations.rows.map(r => ({ type: 'location', text: r.location })),
      ...subjects.rows.map(r => ({ type: 'subject', text: r.subject_expertise }))
    ];

    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};

// ============ RECOMMENDED JOBS ENDPOINTS ============
export const getRecommendedJobs = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const limit = req.query.limit || 10;

    const jobs = await searchModel.getRecommendedJobs(teacherId, limit);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// ============ TRENDING JOBS ENDPOINTS ============
export const getTrendingJobs = async (req, res, next) => {
  try {
    const query = `
      SELECT j.*, COUNT(sa.id) as views
      FROM jobs j
      LEFT JOIN search_analytics sa ON j.id = sa.job_id AND sa.action_type = 'view'
      WHERE j.is_active = true AND sa.action_timestamp > NOW() - INTERVAL '7 days'
      GROUP BY j.id
      ORDER BY views DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
