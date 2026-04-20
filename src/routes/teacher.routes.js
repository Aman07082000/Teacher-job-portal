import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createTeacherProfile, searchJobs, applyJob, trackApplications } from '../controllers/teacher.controller.js';
import uploadResume from '../middleware/uploadResume.js';

const router = express.Router();

router.use(authenticate, authorize(['teacher']));
router.post('/profile', createTeacherProfile);
router.get('/jobs', searchJobs);
router.post('/jobs/:jobId/apply', uploadResume.single('resume'), applyJob);
router.get('/applications', trackApplications);

export default router;
