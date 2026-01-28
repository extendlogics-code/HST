const express = require('express');
const router = express.Router();
const { 
  getCertificates, 
  createCertificate, 
  previewCertificate,
  previewRawCertificate,
  voidCertificate, 
  getCertificatePDF,
  regenerateCertificatePDF
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getCertificates);
router.post('/', createCertificate);
router.post('/preview', previewCertificate);
router.post('/preview-raw', previewRawCertificate);
router.get('/:id/pdf', getCertificatePDF);
router.post('/:id/regenerate-pdf', regenerateCertificatePDF);
router.patch('/:id/void', authorize('ADMIN'), voidCertificate);

module.exports = router;
