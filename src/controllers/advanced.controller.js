import * as advancedModel from '../models/advanced.model.js';
import pool from '../config/db.js';

// ============ TEACHER ANALYTICS ENDPOINTS ============
export const getAnalyticsDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    
    let analytics = await advancedModel.getTeacherAnalytics(teacherId);
    if (!analytics) {
      analytics = await advancedModel.getOrCreateAnalytics(teacherId);
    }

    // Get additional stats
    const applicationStats = await pool.query(
      'SELECT COUNT(*) as total, status FROM applications WHERE teacher_id = $1 GROUP BY status',
      [teacherId]
    );

    const savedJobsCount = await pool.query(
      'SELECT COUNT(*) as count FROM saved_jobs WHERE teacher_id = $1',
      [teacherId]
    );

    res.json({
      analytics,
      applications: applicationStats.rows,
      savedJobs: savedJobsCount.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ============ SKILL ENDORSEMENTS ENDPOINTS ============
export const endorseSkill = async (req, res, next) => {
  try {
    const { teacherId, skill } = req.body;
    const endorsedBy = req.user.id;

    const endorsement = await advancedModel.endorseSkill(teacherId, endorsedBy, skill);
    res.status(201).json(endorsement);
  } catch (err) {
    next(err);
  }
};

export const getSkillEndorsements = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const endorsements = await advancedModel.getSkillEndorsements(teacherId);
    res.json(endorsements);
  } catch (err) {
    next(err);
  }
};

export const removeEndorsement = async (req, res, next) => {
  try {
    const { teacherId, skill } = req.params;
    const endorsedBy = req.user.id;

    await advancedModel.removeSkillEndorsement(teacherId, endorsedBy, skill);
    res.json({ message: 'Endorsement removed' });
  } catch (err) {
    next(err);
  }
};

// ============ INTERVIEW EXPERIENCES ENDPOINTS ============
export const shareInterviewExperience = async (req, res, next) => {
  try {
    const {
      school_id,
      job_id,
      rating,
      experience_type,
      difficulty_level,
      experience_description,
      questions_asked,
      tips_for_candidates
    } = req.body;

    const experience = await advancedModel.shareInterviewExperience({
      teacher_id: req.user.id,
      school_id,
      job_id,
      rating,
      experience_type,
      difficulty_level,
      experience_description,
      questions_asked,
      tips_for_candidates
    });

    res.status(201).json(experience);
  } catch (err) {
    next(err);
  }
};

export const getSchoolInterviewExperiences = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const experiences = await advancedModel.getSchoolExperiences(schoolId);
    res.json(experiences);
  } catch (err) {
    next(err);
  }
};

export const getJobInterviewExperiences = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const experiences = await advancedModel.getJobExperiences(jobId);
    res.json(experiences);
  } catch (err) {
    next(err);
  }
};

// ============ APPLICATION TIMELINE ENDPOINTS ============
export const getApplicationTimeline = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const timeline = await advancedModel.getApplicationTimeline(applicationId);
    res.json(timeline);
  } catch (err) {
    next(err);
  }
};

// ============ NOTIFICATIONS ENDPOINTS ============
export const getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 20;
    
    const notifications = await advancedModel.getUnreadNotifications(userId, limit);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

export const getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 50;
    
    const notifications = await advancedModel.getAllNotifications(userId, limit);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await advancedModel.markNotificationAsRead(notificationId);
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await advancedModel.markAllNotificationsAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// ============ INTERVIEW RESOURCES ENDPOINTS ============
export const getInterviewResources = async (req, res, next) => {
  try {
    const { subject } = req.query;
    const resources = await advancedModel.getInterviewResources(subject);
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

export const viewResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const resource = await advancedModel.incrementResourceView(resourceId);
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

// ============ TWO-WAY RATINGS ENDPOINTS ============
export const rateUser = async (req, res, next) => {
  try {
    const { ratedId, rating, feedback, ratingType } = req.body;
    const raterId = req.user.id;

    const ratingRecord = await advancedModel.rateUser(raterId, ratedId, rating, feedback, ratingType);
    res.status(201).json(ratingRecord);
  } catch (err) {
    next(err);
  }
};

export const getUserRatings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const stats = await advancedModel.getUserRatings(userId);
    const ratings = await advancedModel.getUserReceivedRatings(userId);

    res.json({
      stats,
      ratings
    });
  } catch (err) {
    next(err);
  }
};

// ============ PREMIUM FEATURES ENDPOINTS ============
export const getPremiumStatus = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const premium = await advancedModel.getPremiumStatus(teacherId);
    
    res.json({
      isPremium: !!premium,
      details: premium || null
    });
  } catch (err) {
    next(err);
  }
};

export const upgradeToPremium = async (req, res, next) => {
  try {
    const { tier, durationDays } = req.body;
    const teacherId = req.user.id;

    // In a real app, process payment here
    const premium = await advancedModel.updatePremiumStatus(teacherId, tier, durationDays || 30);
    
    res.json({
      message: 'Upgraded to premium',
      premium
    });
  } catch (err) {
    next(err);
  }
};
