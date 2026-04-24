import db from '../config/db.js';

// School Analytics - Get comprehensive dashboard data
const getSchoolAnalytics = async (schoolId) => {
  try {
    const totalJobs = await db.query(
      'SELECT COUNT(*) as total FROM jobs WHERE school_id = $1',
      [schoolId]
    );

    const totalApplications = await db.query(
      `SELECT COUNT(*) as total FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE j.school_id = $1`,
      [schoolId]
    );

    const applicationsByStatus = await db.query(
      `SELECT status, COUNT(*) as count FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE j.school_id = $1 
       GROUP BY status`,
      [schoolId]
    );

    const offersExtended = await db.query(
      `SELECT COUNT(*) as total FROM applications 
       WHERE status = 'offer_extended' AND job_id IN 
       (SELECT id FROM jobs WHERE school_id = $1)`,
      [schoolId]
    );

    const offersAccepted = await db.query(
      `SELECT COUNT(*) as total FROM applications 
       WHERE status = 'offer_accepted' AND job_id IN 
       (SELECT id FROM jobs WHERE school_id = $1)`,
      [schoolId]
    );

    const hireRate = totalApplications.rows[0]?.total > 0
      ? Math.round((offersAccepted.rows[0]?.total / totalApplications.rows[0]?.total) * 100)
      : 0;

    return {
      totalJobs: totalJobs.rows[0]?.total || 0,
      totalApplications: totalApplications.rows[0]?.total || 0,
      applicationsByStatus: applicationsByStatus.rows || [],
      offersExtended: offersExtended.rows[0]?.total || 0,
      offersAccepted: offersAccepted.rows[0]?.total || 0,
      hireRate,
    };
  } catch (error) {
    throw error;
  }
};

// Get all applicants for school
const getSchoolApplicants = async (schoolId, limit = 50, offset = 0) => {
  try {
    const applicants = await db.query(
      `SELECT DISTINCT a.id, a.teacher_id, u.name, u.email, u.phone, 
              j.title as job_title, a.status, a.created_at, a.updated_at
       FROM applications a
       JOIN users u ON a.teacher_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE j.school_id = $1
       ORDER BY a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [schoolId, limit, offset]
    );

    const totalCount = await db.query(
      `SELECT COUNT(DISTINCT a.id) as total FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE j.school_id = $1`,
      [schoolId]
    );

    return {
      applicants: applicants.rows,
      total: totalCount.rows[0]?.total || 0,
    };
  } catch (error) {
    throw error;
  }
};

// Get applicant details with full profile
const getApplicantDetails = async (schoolId, applicationId) => {
  try {
    const applicant = await db.query(
      `SELECT a.*, u.name, u.email, u.phone, u.location, 
              j.title as job_title, j.id as job_id,
              up.bio, up.education, up.experience
       FROM applications a
       JOIN users u ON a.teacher_id = u.id
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE a.id = $1 AND j.school_id = $2`,
      [applicationId, schoolId]
    );

    return applicant.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Update application status
const updateApplicationStatus = async (schoolId, applicationId, status) => {
  try {
    const result = await db.query(
      `UPDATE applications SET status = $1, updated_at = NOW()
       WHERE id = $2 AND job_id IN (SELECT id FROM jobs WHERE school_id = $3)
       RETURNING *`,
      [status, applicationId, schoolId]
    );

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Get job performance metrics
const getJobPerformance = async (schoolId, jobId) => {
  try {
    const jobPerf = await db.query(
      `SELECT j.*, 
              COUNT(DISTINCT a.id) as total_applications,
              SUM(CASE WHEN a.status = 'viewed' THEN 1 ELSE 0 END) as viewed_count,
              SUM(CASE WHEN a.status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted_count,
              SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
              SUM(CASE WHEN a.status = 'interview_scheduled' THEN 1 ELSE 0 END) as interview_count,
              SUM(CASE WHEN a.status = 'offer_extended' THEN 1 ELSE 0 END) as offer_count
       FROM jobs j
       LEFT JOIN applications a ON j.id = a.job_id
       WHERE j.id = $1 AND j.school_id = $2
       GROUP BY j.id`,
      [jobId, schoolId]
    );

    return jobPerf.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Get all job performances for school
const getAllJobPerformances = async (schoolId) => {
  try {
    const jobs = await db.query(
      `SELECT j.*, 
              COUNT(DISTINCT a.id) as total_applications,
              SUM(CASE WHEN a.status = 'viewed' THEN 1 ELSE 0 END) as viewed_count,
              SUM(CASE WHEN a.status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted_count,
              SUM(CASE WHEN a.status = 'interview_scheduled' THEN 1 ELSE 0 END) as interview_count,
              SUM(CASE WHEN a.status = 'offer_extended' THEN 1 ELSE 0 END) as offer_count
       FROM jobs j
       LEFT JOIN applications a ON j.id = a.job_id
       WHERE j.school_id = $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [schoolId]
    );

    return jobs.rows || [];
  } catch (error) {
    throw error;
  }
};

// Get school profile strength
const getSchoolProfileStrength = async (schoolId) => {
  try {
    const school = await db.query(
      'SELECT * FROM schools WHERE id = $1',
      [schoolId]
    );

    if (!school.rows[0]) return null;

    const data = school.rows[0];
    let strength = 0;

    // Calculate profile strength (0-100)
    if (data.name) strength += 15;
    if (data.description) strength += 15;
    if (data.location) strength += 15;
    if (data.contact_email) strength += 15;
    if (data.phone) strength += 10;
    if (data.website) strength += 15;
    if (data.logo_url) strength += 15;

    return {
      strength,
      completedFields: [
        { name: 'Name', completed: !!data.name },
        { name: 'Description', completed: !!data.description },
        { name: 'Location', completed: !!data.location },
        { name: 'Email', completed: !!data.contact_email },
        { name: 'Phone', completed: !!data.phone },
        { name: 'Website', completed: !!data.website },
        { name: 'Logo', completed: !!data.logo_url },
      ],
    };
  } catch (error) {
    throw error;
  }
};

// Create candidate shortlist
const createShortlist = async (schoolId, applicationId, notes = '') => {
  try {
    const result = await db.query(
      `INSERT INTO candidate_shortlists (school_id, application_id, notes, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (application_id) DO UPDATE SET notes = $3, updated_at = NOW()
       RETURNING *`,
      [schoolId, applicationId, notes]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get school shortlist
const getSchoolShortlist = async (schoolId) => {
  try {
    const shortlist = await db.query(
      `SELECT cs.*, u.name, u.email, j.title as job_title
       FROM candidate_shortlists cs
       JOIN applications a ON cs.application_id = a.id
       JOIN users u ON a.teacher_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE cs.school_id = $1
       ORDER BY cs.created_at DESC`,
      [schoolId]
    );

    return shortlist.rows || [];
  } catch (error) {
    throw error;
  }
};

// Remove from shortlist
const removeFromShortlist = async (schoolId, applicationId) => {
  try {
    const result = await db.query(
      `DELETE FROM candidate_shortlists 
       WHERE application_id = $1 AND school_id = $2
       RETURNING *`,
      [applicationId, schoolId]
    );

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Rate a candidate/teacher
const rateCandidateBySchool = async (schoolId, teacherId, rating, feedback = '') => {
  try {
    const result = await db.query(
      `INSERT INTO school_to_teacher_ratings (school_id, teacher_id, rating, feedback, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (school_id, teacher_id) DO UPDATE 
       SET rating = $3, feedback = $4, updated_at = NOW()
       RETURNING *`,
      [schoolId, teacherId, rating, feedback]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get candidate ratings
const getCandidateRatings = async (teacherId) => {
  try {
    const ratings = await db.query(
      `SELECT str.*, s.name as school_name, s.logo_url
       FROM school_to_teacher_ratings str
       JOIN schools s ON str.school_id = s.id
       WHERE str.teacher_id = $1
       ORDER BY str.created_at DESC`,
      [teacherId]
    );

    const avgRating = await db.query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
       FROM school_to_teacher_ratings
       WHERE teacher_id = $1`,
      [teacherId]
    );

    return {
      ratings: ratings.rows || [],
      averageRating: parseFloat(avgRating.rows[0]?.average_rating || 0).toFixed(1),
      totalRatings: avgRating.rows[0]?.total_ratings || 0,
    };
  } catch (error) {
    throw error;
  }
};

// Schedule interview
const scheduleInterview = async (schoolId, applicationId, interviewDate, interviewType, notes = '') => {
  try {
    const result = await db.query(
      `INSERT INTO interview_schedules (school_id, application_id, interview_date, interview_type, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [schoolId, applicationId, interviewDate, interviewType, notes]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get scheduled interviews
const getScheduledInterviews = async (schoolId) => {
  try {
    const interviews = await db.query(
      `SELECT ics.*, u.name, u.email, j.title as job_title
       FROM interview_schedules ics
       JOIN applications a ON ics.application_id = a.id
       JOIN users u ON a.teacher_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE ics.school_id = $1
       ORDER BY ics.interview_date ASC`,
      [schoolId]
    );

    return interviews.rows || [];
  } catch (error) {
    throw error;
  }
};

// Get hiring pipeline
const getHiringPipeline = async (schoolId) => {
  try {
    const pipeline = await db.query(
      `SELECT 
              'Applied' as stage, COUNT(*) as count FROM applications a
              JOIN jobs j ON a.job_id = j.id
              WHERE j.school_id = $1 AND a.status = 'applied'
       UNION ALL
       SELECT 'Shortlisted', COUNT(*) FROM applications a
              JOIN jobs j ON a.job_id = j.id
              WHERE j.school_id = $1 AND a.status = 'shortlisted'
       UNION ALL
       SELECT 'Interview Scheduled', COUNT(*) FROM applications a
              JOIN jobs j ON a.job_id = j.id
              WHERE j.school_id = $1 AND a.status = 'interview_scheduled'
       UNION ALL
       SELECT 'Offer Extended', COUNT(*) FROM applications a
              JOIN jobs j ON a.job_id = j.id
              WHERE j.school_id = $1 AND a.status = 'offer_extended'
       UNION ALL
       SELECT 'Hired', COUNT(*) FROM applications a
              JOIN jobs j ON a.job_id = j.id
              WHERE j.school_id = $1 AND a.status = 'offer_accepted'`,
      [schoolId]
    );

    return pipeline.rows || [];
  } catch (error) {
    throw error;
  }
};

// Compare candidates
const compareCandidates = async (schoolId, applicationIds) => {
  try {
    const candidates = await db.query(
      `SELECT DISTINCT a.id, a.teacher_id, u.name, u.email, u.location,
              j.title as job_title, a.status, a.created_at,
              up.bio, up.education, up.experience
       FROM applications a
       JOIN users u ON a.teacher_id = u.id
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE a.id = ANY($1) AND j.school_id = $2`,
      [applicationIds, schoolId]
    );

    return candidates.rows || [];
  } catch (error) {
    throw error;
  }
};

export default {
  getSchoolAnalytics,
  getSchoolApplicants,
  getApplicantDetails,
  updateApplicationStatus,
  getJobPerformance,
  getAllJobPerformances,
  getSchoolProfileStrength,
  createShortlist,
  getSchoolShortlist,
  removeFromShortlist,
  rateCandidateBySchool,
  getCandidateRatings,
  scheduleInterview,
  getScheduledInterviews,
  getHiringPipeline,
  compareCandidates,
};
