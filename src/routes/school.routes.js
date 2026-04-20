import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createSchoolProfile, postJob, manageApplicants, shortlistCandidate } from '../controllers/school.controller.js';

const router = express.Router();

router.use(authenticate, authorize(['school']));
router.post('/profile', createSchoolProfile);
router.post('/jobs', postJob);
router.get('/applicants', manageApplicants);
router.post('/applicants/:applicationId/shortlist', shortlistCandidate);

export default router;
