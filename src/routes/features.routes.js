import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as featuresController from '../controllers/features.controller.js';

const router = express.Router();

// All routes require teacher authentication
router.use(authenticate, authorize(['teacher']));

// ============ SAVED JOBS ROUTES ============
router.post('/saved-jobs/:jobId', featuresController.saveJob);
router.delete('/saved-jobs/:jobId', featuresController.removeSavedJob);
router.get('/saved-jobs', featuresController.getSavedJobs);
router.get('/saved-jobs/:jobId/check', featuresController.checkSavedJob);
router.get('/saved-jobs/count', featuresController.getSavedJobsCount);

// ============ JOB ALERTS ROUTES ============
router.post('/job-alerts', featuresController.createJobAlert);
router.get('/job-alerts', featuresController.getJobAlerts);
router.put('/job-alerts/:alertId', featuresController.updateJobAlert);
router.delete('/job-alerts/:alertId', featuresController.deleteJobAlert);

// ============ FOLLOWED SCHOOLS ROUTES ============
router.post('/followed-schools/:schoolId', featuresController.followSchool);
router.delete('/followed-schools/:schoolId', featuresController.unfollowSchool);
router.get('/followed-schools', featuresController.getFollowedSchools);
router.get('/followed-schools/:schoolId/check', featuresController.checkFollowingSchool);

// ============ PROFILE STRENGTH ROUTES ============
router.get('/profile-strength/:teacherId', featuresController.getProfileStrength);
router.put('/profile-strength', featuresController.updateProfileStrength);
router.post('/profile-strength/calculate', featuresController.calculateStrength);

// ============ JOB MATCH SCORE ROUTES ============
router.get('/match-score/:jobId', featuresController.getJobMatchScore);
router.post('/match-scores', featuresController.calculateAllMatchScores);

// ============ STATISTICS ROUTES ============
router.get('/stats', featuresController.getTeacherStats);
router.get('/stats/:teacherId', featuresController.getTeacherStats);

export default router;
