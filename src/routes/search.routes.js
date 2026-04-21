import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as searchController from '../controllers/search.controller.js';

const router = express.Router();

// ============ SEARCH HISTORY ROUTES ============
router.post('/search/save', authenticate, searchController.saveSearch);
router.get('/search/history', authenticate, searchController.getRecentSearches);
router.delete('/search/history', authenticate, searchController.clearAllSearchHistory);
router.delete('/search/history/:searchId', authenticate, searchController.deleteSearchHistoryItem);

// ============ SAVED SEARCHES ROUTES ============
router.post('/saved-searches', authenticate, searchController.createSavedSearch);
router.get('/saved-searches', authenticate, searchController.getSavedSearches);
router.put('/saved-searches/:searchId', authenticate, searchController.updateSavedSearch);
router.delete('/saved-searches/:searchId', authenticate, searchController.deleteSavedSearch);

// ============ JOB COMPARISON ROUTES ============
router.post('/comparisons', authenticate, searchController.createJobComparison);
router.get('/comparisons', authenticate, searchController.getMyComparisons);
router.post('/comparisons/:comparisonId/jobs', authenticate, searchController.addJobToComparison);
router.delete('/comparisons/:comparisonId/jobs', authenticate, searchController.removeJobFromComparison);
router.delete('/comparisons/:comparisonId', authenticate, searchController.deleteJobComparison);

// ============ ADVANCED SEARCH ROUTES ============
router.get('/search', searchController.advancedSearch); // Public
router.get('/search/suggestions', searchController.getSearchSuggestions); // Public
router.get('/categories', searchController.getJobCategories); // Public
router.get('/locations', searchController.getLocationStats); // Public

// ============ RECOMMENDED JOBS ROUTES ============
router.get('/recommended', authenticate, searchController.getRecommendedJobs);
router.get('/trending', searchController.getTrendingJobs); // Public

export default router;
