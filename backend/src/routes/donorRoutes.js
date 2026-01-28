const express = require('express');
const router = express.Router();
const { getDonors, createDonor, getDonor, updateDonor } = require('../controllers/donorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getDonors);
router.post('/', createDonor);
router.get('/:id', getDonor);
router.patch('/:id', updateDonor);

module.exports = router;
