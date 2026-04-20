import pool from '../config/db.js';

// ============ SEARCH HISTORY MODEL ============
export const saveSearchHistory = async (teacherId, searchQuery, filters, resultsCount) => {
  const query = `
    INSERT INTO search_history (teacher_id, search_query, filters, results_count)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, searchQuery, JSON.stringify(filters), resultsCount]);
  return result.rows[0];
};

export const getSearchHistory = async (teacherId, limit = 20) => {
  const query = `
    SELECT * FROM search_history 
    WHERE teacher_id = $1 
    ORDER BY searched_at DESC 
    LIMIT $2;
  `;
  const result = await pool.query(query, [teacherId, limit]);
  return result.rows.map(row => ({
    ...row,
    filters: JSON.parse(row.filters)
  }));
};

export const clearSearchHistory = async (teacherId) => {
  const query = `DELETE FROM search_history WHERE teacher_id = $1;`;
  await pool.query(query, [teacherId]);
};

export const deleteSearchHistoryItem = async (searchId) => {
  const query = `DELETE FROM search_history WHERE id = $1;`;
  await pool.query(query, [searchId]);
};

// ============ SAVED SEARCHES MODEL ============
export const createSavedSearch = async (teacherId, searchData) => {
  const { name, search_query, filters, frequency } = searchData;
  const query = `
    INSERT INTO saved_searches (teacher_id, name, search_query, filters, frequency)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    teacherId,
    name,
    search_query,
    JSON.stringify(filters),
    frequency
  ]);
  return {
    ...result.rows[0],
    filters: JSON.parse(result.rows[0].filters)
  };
};

export const getSavedSearches = async (teacherId) => {
  const query = `
    SELECT * FROM saved_searches 
    WHERE teacher_id = $1 AND is_active = true
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows.map(row => ({
    ...row,
    filters: JSON.parse(row.filters)
  }));
};

export const updateSavedSearch = async (searchId, searchData) => {
  const { name, search_query, filters, frequency, is_active } = searchData;
  const query = `
    UPDATE saved_searches 
    SET name = $1, search_query = $2, filters = $3, frequency = $4, is_active = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *;
  `;
  const result = await pool.query(query, [
    name,
    search_query,
    JSON.stringify(filters),
    frequency,
    is_active,
    searchId
  ]);
  return {
    ...result.rows[0],
    filters: JSON.parse(result.rows[0].filters)
  };
};

export const deleteSavedSearch = async (searchId) => {
  const query = `DELETE FROM saved_searches WHERE id = $1;`;
  await pool.query(query, [searchId]);
};

// ============ JOB COMPARISON MODEL ============
export const createComparison = async (teacherId, jobIds, comparisonName) => {
  const query = `
    INSERT INTO job_comparisons (teacher_id, job_ids, comparison_name)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, jobIds, comparisonName]);
  return result.rows[0];
};

export const getComparisons = async (teacherId) => {
  const query = `
    SELECT * FROM job_comparisons 
    WHERE teacher_id = $1 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [teacherId]);
  return result.rows;
};

export const addJobToComparison = async (comparisonId, jobId) => {
  const query = `
    UPDATE job_comparisons 
    SET job_ids = array_append(job_ids, $1), updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [jobId, comparisonId]);
  return result.rows[0];
};

export const removeJobFromComparison = async (comparisonId, jobId) => {
  const query = `
    UPDATE job_comparisons 
    SET job_ids = array_remove(job_ids, $1), updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [jobId, comparisonId]);
  return result.rows[0];
};

export const deleteComparison = async (comparisonId) => {
  const query = `DELETE FROM job_comparisons WHERE id = $1;`;
  await pool.query(query, [comparisonId]);
};

// ============ SEARCH ANALYTICS MODEL ============
export const trackSearch = async (teacherId, actionType, jobId = null) => {
  const query = `
    INSERT INTO search_analytics (teacher_id, job_id, action_type)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [teacherId, jobId, actionType]);
  return result.rows[0];
};

export const getSearchAnalytics = async (teacherId, actionType = null) => {
  let query = `
    SELECT * FROM search_analytics 
    WHERE teacher_id = $1
  `;
  const params = [teacherId];
  
  if (actionType) {
    query += ` AND action_type = $2`;
    params.push(actionType);
  }
  
  query += ` ORDER BY action_timestamp DESC;`;
  const result = await pool.query(query, params);
  return result.rows;
};

export const getRecommendedJobs = async (teacherId, limit = 10) => {
  const query = `
    SELECT j.*, COUNT(sa.id) as interaction_count
    FROM jobs j
    LEFT JOIN search_analytics sa ON j.id = sa.job_id AND sa.teacher_id = $1
    WHERE j.id NOT IN (
      SELECT job_id FROM applications WHERE teacher_id = $1
    )
    GROUP BY j.id
    ORDER BY interaction_count DESC, j.posted_at DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [teacherId, limit]);
  return result.rows;
};

// ============ JOB CATEGORIES MODEL ============
export const getJobCategories = async () => {
  const query = `
    SELECT * FROM job_categories 
    ORDER BY count DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getTrendingCategories = async (limit = 5) => {
  const query = `
    SELECT * FROM job_categories 
    WHERE trending = true 
    ORDER BY count DESC 
    LIMIT $1;
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const updateJobCategories = async () => {
  const query = `
    INSERT INTO job_categories (subject_expertise, count, avg_salary, latest_posting)
    SELECT 
      subject_expertise,
      COUNT(*) as count,
      AVG(salary_min)::DECIMAL(10,2) as avg_salary,
      MAX(posted_at) as latest_posting
    FROM jobs
    GROUP BY subject_expertise
    ON CONFLICT (id) DO UPDATE SET 
      count = EXCLUDED.count,
      avg_salary = EXCLUDED.avg_salary,
      latest_posting = EXCLUDED.latest_posting,
      updated_at = NOW();
  `;
  await pool.query(query);
};

// ============ LOCATION STATS MODEL ============
export const getLocationStats = async () => {
  const query = `
    SELECT * FROM location_stats 
    ORDER BY job_count DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getTopLocations = async (limit = 10) => {
  const query = `
    SELECT * FROM location_stats 
    ORDER BY job_count DESC 
    LIMIT $1;
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

export const updateLocationStats = async () => {
  const query = `
    INSERT INTO location_stats (location, job_count, avg_salary, schools_count)
    SELECT 
      location,
      COUNT(*) as job_count,
      AVG(salary_min)::DECIMAL(10,2) as avg_salary,
      COUNT(DISTINCT school_id) as schools_count
    FROM jobs
    GROUP BY location
    ON CONFLICT (location) DO UPDATE SET 
      job_count = EXCLUDED.job_count,
      avg_salary = EXCLUDED.avg_salary,
      schools_count = EXCLUDED.schools_count,
      updated_at = NOW();
  `;
  await pool.query(query);
};

// ============ SEARCH SUGGESTIONS MODEL ============
export const getSearchSuggestions = async (query, limit = 10) => {
  const suggestionQuery = `
    SELECT DISTINCT subject_expertise as suggestion 
    FROM jobs 
    WHERE subject_expertise ILIKE $1 
    LIMIT $2;
  `;
  const result = await pool.query(suggestionQuery, [`${query}%`, limit]);
  return result.rows.map(row => row.suggestion);
};

export const getLocationSuggestions = async (query, limit = 10) => {
  const suggestionQuery = `
    SELECT DISTINCT location as suggestion 
    FROM jobs 
    WHERE location ILIKE $1 
    LIMIT $2;
  `;
  const result = await pool.query(suggestionQuery, [`${query}%`, limit]);
  return result.rows.map(row => row.suggestion);
};

// ============ ADVANCED SEARCH MODEL ============
export const advancedSearch = async (filters) => {
  let query = `SELECT * FROM jobs WHERE 1=1`;
  const params = [];
  let paramCount = 1;

  // Subject expertise
  if (filters.subject_expertise) {
    query += ` AND subject_expertise ILIKE $${paramCount}`;
    params.push(`%${filters.subject_expertise}%`);
    paramCount++;
  }

  // Location
  if (filters.location) {
    query += ` AND location ILIKE $${paramCount}`;
    params.push(`%${filters.location}%`);
    paramCount++;
  }

  // Salary range
  if (filters.min_salary) {
    query += ` AND salary_min >= $${paramCount}`;
    params.push(filters.min_salary);
    paramCount++;
  }
  if (filters.max_salary) {
    query += ` AND salary_max <= $${paramCount}`;
    params.push(filters.max_salary);
    paramCount++;
  }

  // Experience required
  if (filters.experience_required) {
    query += ` AND experience_required <= $${paramCount}`;
    params.push(filters.experience_required);
    paramCount++;
  }

  // Job type
  if (filters.job_type) {
    query += ` AND job_type = $${paramCount}`;
    params.push(filters.job_type);
    paramCount++;
  }

  // Posted date
  if (filters.posted_days) {
    query += ` AND posted_at >= NOW() - INTERVAL '${filters.posted_days} days'`;
  }

  // Sort
  if (filters.sort_by) {
    switch (filters.sort_by) {
      case 'newest':
        query += ` ORDER BY posted_at DESC`;
        break;
      case 'salary_high':
        query += ` ORDER BY salary_max DESC`;
        break;
      case 'salary_low':
        query += ` ORDER BY salary_min ASC`;
        break;
      case 'relevant':
        query += ` ORDER BY posted_at DESC`;
        break;
      default:
        query += ` ORDER BY posted_at DESC`;
    }
  } else {
    query += ` ORDER BY posted_at DESC`;
  }

  // Pagination
  if (filters.limit) {
    query += ` LIMIT $${paramCount}`;
    params.push(filters.limit);
    paramCount++;
  } else {
    query += ` LIMIT 20`;
  }

  if (filters.offset) {
    query += ` OFFSET $${paramCount}`;
    params.push(filters.offset);
  }

  const result = await pool.query(query, params);
  return result.rows;
};

// ============ GET QUICK FILTER OPTIONS ============
export const getQuickFilters = async () => {
  const subjectsQuery = `
    SELECT DISTINCT subject_expertise 
    FROM jobs 
    GROUP BY subject_expertise 
    ORDER BY COUNT(*) DESC 
    LIMIT 15;
  `;

  const locationsQuery = `
    SELECT DISTINCT location 
    FROM jobs 
    GROUP BY location 
    ORDER BY COUNT(*) DESC 
    LIMIT 15;
  `;

  const [subjects, locations] = await Promise.all([
    pool.query(subjectsQuery),
    pool.query(locationsQuery)
  ]);

  return {
    subjects: subjects.rows.map(r => r.subject_expertise),
    locations: locations.rows.map(r => r.location),
    salary_ranges: [
      { label: 'Any', min: null, max: null },
      { label: 'Under 40k', min: null, max: 40000 },
      { label: '40k - 60k', min: 40000, max: 60000 },
      { label: '60k - 80k', min: 60000, max: 80000 },
      { label: 'Above 80k', min: 80000, max: null }
    ],
    experience_levels: [
      { label: 'Fresher', value: 0 },
      { label: '1-3 years', value: 1 },
      { label: '3-5 years', value: 3 },
      { label: '5+ years', value: 5 }
    ],
    job_types: [
      { label: 'Full-time', value: 'Full-time' },
      { label: 'Part-time', value: 'Part-time' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Temporary', value: 'Temporary' }
    ],
    posted_dates: [
      { label: 'Last 24 hours', value: 1 },
      { label: 'Last 7 days', value: 7 },
      { label: 'Last 30 days', value: 30 },
      { label: 'Anytime', value: null }
    ]
  };
};
