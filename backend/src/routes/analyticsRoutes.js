const express = require('express');
const router = express.Router();
const { trackVisit, getAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Public route to track visits
router.post('/track', trackVisit);

// Private route to get stats
router.get('/stats', protect, authorize('ADMIN'), getAnalytics);

module.exports = router;
