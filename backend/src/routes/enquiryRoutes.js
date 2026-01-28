const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, deleteEnquiry, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createEnquiry);
router.get('/', protect, authorize('ADMIN'), getEnquiries);
router.delete('/:id', protect, authorize('ADMIN'), deleteEnquiry);
router.patch('/:id/status', protect, authorize('ADMIN'), updateEnquiryStatus);

module.exports = router;
