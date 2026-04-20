import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as featuresController from '../controllers/features.controller.js';
import { getSchoolProfile, getSchoolJobs } from '../controllers/school.controller.js';

const router = express.Router();

// ============ REVIEWS ROUTES (REQUIRE AUTHENTICATION) ============
router.post('/reviews', authenticate, featuresController.createReview);
router.put('/reviews/:reviewId', authenticate, featuresController.updateReview);
router.delete('/reviews/:reviewId', authenticate, featuresController.deleteReview);

// ============ REVIEWS ROUTES (PUBLIC) ============
router.get('/reviews/:userId', featuresController.getReviews);

// ============ SCHOOL PROFILES ROUTES (PUBLIC) ============
router.get('/schools/:schoolId/profile', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    // Fetch school profile - implement this in school controller
    // For now, return basic structure
    res.json({ schoolId, message: 'School profile endpoint' });
  } catch (err) {
    next(err);
  }
});

router.get('/schools/:schoolId/jobs', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    // Fetch school's active jobs
    res.json({ schoolId, message: 'School jobs endpoint' });
  } catch (err) {
    next(err);
  }
});

router.get('/schools/:schoolId/followers-count', featuresController.getFollowersCount);

export default router;
