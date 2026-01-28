const express = require('express');
const router = express.Router();
const { 
  getSettings, 
  updateSettings, 
  uploadAsset, 
  updateSignature, 
  updateSeal,
  updateLogo
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/trust', getSettings);
router.put('/trust', authorize('ADMIN'), updateSettings);
router.post('/assets/signature', authorize('ADMIN'), uploadAsset, updateSignature);
router.post('/assets/seal', authorize('ADMIN'), uploadAsset, updateSeal);
router.post('/assets/logo', authorize('ADMIN'), uploadAsset, updateLogo);

module.exports = router;
