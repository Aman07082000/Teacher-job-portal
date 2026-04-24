import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as advancedController from '../controllers/advanced.controller.js';

const router = express.Router();

// ============ TEACHER ANALYTICS ROUTES ============
router.get('/analytics/dashboard', authenticate, advancedController.getAnalyticsDashboard);

// ============ SKILL ENDORSEMENTS ROUTES ============
router.post('/endorsements', authenticate, advancedController.endorseSkill);
router.get('/endorsements/:teacherId', advancedController.getSkillEndorsements);
router.delete('/endorsements/:teacherId/:skill', authenticate, advancedController.removeEndorsement);

// ============ INTERVIEW EXPERIENCES ROUTES ============
router.post('/interview-experiences', authenticate, advancedController.shareInterviewExperience);
router.get('/interview-experiences/school/:schoolId', advancedController.getSchoolInterviewExperiences);
router.get('/interview-experiences/job/:jobId', advancedController.getJobInterviewExperiences);

// ============ APPLICATION TIMELINE ROUTES ============
router.get('/application-timeline/:applicationId', authenticate, advancedController.getApplicationTimeline);

// ============ NOTIFICATIONS ROUTES ============
router.get('/notifications/unread', authenticate, advancedController.getUnreadNotifications);
router.get('/notifications', authenticate, advancedController.getAllNotifications);
router.put('/notifications/:notificationId/read', authenticate, advancedController.markAsRead);
router.put('/notifications/mark-all-read', authenticate, advancedController.markAllAsRead);

// ============ INTERVIEW RESOURCES ROUTES ============
router.get('/interview-resources', advancedController.getInterviewResources);
router.get('/interview-resources/:resourceId/view', advancedController.viewResource);

// ============ TWO-WAY RATINGS ROUTES ============
router.post('/ratings', authenticate, advancedController.rateUser);
router.get('/ratings/:userId', advancedController.getUserRatings);

// ============ PREMIUM FEATURES ROUTES ============
router.get('/premium/status', authenticate, advancedController.getPremiumStatus);
router.post('/premium/upgrade', authenticate, advancedController.upgradeToPremium);

export default router;
