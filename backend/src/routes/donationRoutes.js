const express = require('express');
const router = express.Router();
const { getDonations, createDonation, updateDonationStatus } = require('../controllers/donationController');
const { protect, optionalProtect } = require('../middleware/auth');

router.get('/', protect, getDonations);
router.post('/', optionalProtect, createDonation);
router.patch('/:id/status', optionalProtect, updateDonationStatus);

module.exports = router;
