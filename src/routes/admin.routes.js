import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { 
  getUsers, 
  monitorJobs, 
  analytics, 
  updateUserAdmin, 
  deleteUserAdmin, 
  updateJobAdmin, 
  deleteJobAdmin 
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorize(['admin']));

// Read operations
router.get('/users', getUsers);
router.get('/jobs', monitorJobs);
router.get('/analytics', analytics);

// Update operations (admin only)
router.put('/users/:userId', updateUserAdmin);
router.put('/jobs/:jobId', updateJobAdmin);

// Delete operations (admin only)
router.delete('/users/:userId', deleteUserAdmin);
router.delete('/jobs/:jobId', deleteJobAdmin);

export default router;
