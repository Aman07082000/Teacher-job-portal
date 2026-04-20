import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { getAllJobs, searchJobs, seedJobs, clearJobs } from '../controllers/job.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/search', searchJobs);

// Admin-only routes for testing/data management
router.post('/seed', authenticate, authorize(['admin']), seedJobs);
router.delete('/clear', authenticate, authorize(['admin']), clearJobs);

export default router;
