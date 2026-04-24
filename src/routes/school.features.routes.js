import express from 'express';
import schoolFeaturesController from '../controllers/school.features.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all school feature routes
router.use(auth.verifyToken);

// Analytics and Dashboard
router.get('/analytics', schoolFeaturesController.getSchoolAnalytics);
router.get('/profile-strength', schoolFeaturesController.getSchoolProfileStrength);

// Applicant Management
router.get('/applicants', schoolFeaturesController.getSchoolApplicants);
router.get('/applicants/:applicationId', schoolFeaturesController.getApplicantDetails);
router.put('/applicants/:applicationId/status', schoolFeaturesController.updateApplicationStatus);

// Job Performance
router.get('/jobs/:jobId/performance', schoolFeaturesController.getJobPerformance);
router.get('/jobs/performance/all', schoolFeaturesController.getAllJobPerformances);

// Candidate Shortlist
router.post('/shortlist', schoolFeaturesController.createShortlist);
router.get('/shortlist', schoolFeaturesController.getSchoolShortlist);
router.delete('/shortlist/:applicationId', schoolFeaturesController.removeFromShortlist);

// Candidate Ratings
router.post('/ratings', schoolFeaturesController.rateCandidateBySchool);
router.get('/ratings/:teacherId', schoolFeaturesController.getCandidateRatings);

// Interview Management
router.post('/interviews/schedule', schoolFeaturesController.scheduleInterview);
router.get('/interviews', schoolFeaturesController.getScheduledInterviews);

// Hiring Pipeline
router.get('/hiring-pipeline', schoolFeaturesController.getHiringPipeline);

// Candidate Comparison
router.post('/candidates/compare', schoolFeaturesController.compareCandidates);

export default router;
