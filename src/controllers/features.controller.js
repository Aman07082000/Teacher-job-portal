import * as featuresModel from '../models/features.model.js';

// ============ SAVED JOBS CONTROLLER ============
export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const teacherId = req.user.id;

    await featuresModel.saveJob(teacherId, parseInt(jobId));
    res.status(201).json({ message: 'Job saved successfully' });
  } catch (err) {
    next(err);
  }
};

export const removeSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const teacherId = req.user.id;

    await featuresModel.removeSavedJob(teacherId, parseInt(jobId));
    res.json({ message: 'Job removed from saved list' });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const jobs = await featuresModel.getSavedJobs(teacherId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const checkSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const teacherId = req.user.id;

    const isSaved = await featuresModel.isSavedJob(teacherId, parseInt(jobId));
    res.json({ isSaved });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobsCount = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const count = await featuresModel.getSavedJobsCount(teacherId);
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// ============ JOB ALERTS CONTROLLER ============
export const createJobAlert = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const alert = req.body;

    const newAlert = await featuresModel.createJobAlert(teacherId, alert);
    res.status(201).json(newAlert);
  } catch (err) {
    next(err);
  }
};

export const getJobAlerts = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const alerts = await featuresModel.getJobAlerts(teacherId);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

export const updateJobAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const alert = req.body;

    const updatedAlert = await featuresModel.updateJobAlert(parseInt(alertId), alert);
    res.json(updatedAlert);
  } catch (err) {
    next(err);
  }
};

export const deleteJobAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    await featuresModel.deleteJobAlert(parseInt(alertId));
    res.json({ message: 'Job alert deleted' });
  } catch (err) {
    next(err);
  }
};

// ============ RATINGS & REVIEWS CONTROLLER ============
export const createReview = async (req, res, next) => {
  try {
    const { reviewed_id, rating, review_text, category } = req.body;
    const reviewerId = req.user.id;

    if (reviewed_id === reviewerId) {
      return res.status(400).json({ error: 'Cannot review yourself' });
    }

    const reviewData = {
      reviewer_id: reviewerId,
      reviewed_id,
      reviewer_role: req.user.role,
      rating,
      review_text,
      category,
    };

    const review = await featuresModel.createReview(reviewData);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await featuresModel.getReviews(parseInt(userId));
    const stats = await featuresModel.getReviewStats(parseInt(userId));

    res.json({ reviews, stats });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, review_text } = req.body;

    const updatedReview = await featuresModel.updateReview(parseInt(reviewId), { rating, review_text });
    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    await featuresModel.deleteReview(parseInt(reviewId));
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

// ============ FOLLOWED SCHOOLS CONTROLLER ============
export const followSchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const teacherId = req.user.id;

    await featuresModel.followSchool(teacherId, parseInt(schoolId));
    res.status(201).json({ message: 'School followed successfully' });
  } catch (err) {
    next(err);
  }
};

export const unfollowSchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const teacherId = req.user.id;

    await featuresModel.unfollowSchool(teacherId, parseInt(schoolId));
    res.json({ message: 'School unfollowed' });
  } catch (err) {
    next(err);
  }
};

export const getFollowedSchools = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const schools = await featuresModel.getFollowedSchools(teacherId);
    res.json(schools);
  } catch (err) {
    next(err);
  }
};

export const checkFollowingSchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const teacherId = req.user.id;

    const isFollowing = await featuresModel.isFollowingSchool(teacherId, parseInt(schoolId));
    res.json({ isFollowing });
  } catch (err) {
    next(err);
  }
};

export const getFollowersCount = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const count = await featuresModel.getFollowersCount(parseInt(schoolId));
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// ============ PROFILE STRENGTH CONTROLLER ============
export const getProfileStrength = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    let strength = await featuresModel.getProfileStrength(parseInt(teacherId));

    if (!strength) {
      await featuresModel.initializeProfileStrength(parseInt(teacherId));
      strength = await featuresModel.getProfileStrength(parseInt(teacherId));
    }

    res.json(strength);
  } catch (err) {
    next(err);
  }
};

export const updateProfileStrength = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const strengthData = req.body;

    // Ensure profile strength record exists
    await featuresModel.initializeProfileStrength(teacherId);

    // Calculate actual strength percentage
    const calculatedStrength = await featuresModel.calculateProfileStrength(teacherId);

    // Update with all data
    const updated = await featuresModel.updateProfileStrength(teacherId, {
      ...strengthData,
      strength_percentage: calculatedStrength,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const calculateStrength = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    
    // Ensure profile strength record exists
    await featuresModel.initializeProfileStrength(teacherId);

    const strength = await featuresModel.calculateProfileStrength(teacherId);
    
    const strengthData = {
      strength_percentage: strength,
      has_photo: false,
      has_resume: false,
      has_bio: false,
      has_experience_years: false,
      has_certifications: false,
    };

    const updated = await featuresModel.updateProfileStrength(teacherId, strengthData);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ============ JOB MATCH SCORE CONTROLLER ============
export const getJobMatchScore = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const teacherId = req.user.id;

    let score = await featuresModel.getMatchScore(teacherId, parseInt(jobId));

    if (!score) {
      score = await featuresModel.calculateJobMatchScore(teacherId, parseInt(jobId));
      await featuresModel.saveMatchScore(teacherId, parseInt(jobId), score);
    }

    res.json({ jobId: parseInt(jobId), match_score: score });
  } catch (err) {
    next(err);
  }
};

export const calculateAllMatchScores = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { jobIds } = req.body;

    const scores = await Promise.all(
      jobIds.map(async (jobId) => {
        const score = await featuresModel.calculateJobMatchScore(teacherId, jobId);
        await featuresModel.saveMatchScore(teacherId, jobId, score);
        return { jobId, score };
      })
    );

    res.json(scores);
  } catch (err) {
    next(err);
  }
};

// ============ STATISTICS CONTROLLER ============
export const getTeacherStats = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId || req.user.id;
    const stats = await featuresModel.getTeacherStats(parseInt(teacherId));
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
