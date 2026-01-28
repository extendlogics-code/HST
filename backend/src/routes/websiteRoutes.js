const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  impactStatsController,
  partnersController,
  heroSlidesController,
  sectionsController,
  aboutController,
  causesController,
  newsController,
  ctaController,
  legalitiesController,
  initiativesController,
  headerController,
  footerController,
  landingPageController,
  donateController
} = require('../controllers/websiteController');
const { protect, authorize } = require('../middleware/auth');

// Multer config for website assets
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/website/');
  },
  filename: (req, file, cb) => {
    const section = req.body.section || 'asset';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${section}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images and SVGs are allowed'));
  }
});

// Image upload route
router.post('/upload', protect, authorize('ADMIN'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const url = `uploads/website/${req.file.filename}`;
  res.json({ success: true, url });
});

// Sections Management
router.get('/sections', sectionsController.getAll);
router.put('/sections/reorder', protect, authorize('ADMIN'), sectionsController.reorder);
router.put('/sections/:id', protect, authorize('ADMIN'), sectionsController.update);

// About Section
router.get('/about', aboutController.get);
router.put('/about', protect, authorize('ADMIN'), aboutController.update);

// Causes Section
router.get('/causes', causesController.getAll);
router.get('/causes/admin', protect, authorize('ADMIN'), causesController.getAllAdmin);
router.post('/causes', protect, authorize('ADMIN'), causesController.create);
router.put('/causes/:id', protect, authorize('ADMIN'), causesController.update);
router.delete('/causes/:id', protect, authorize('ADMIN'), causesController.delete);

// News Section
router.get('/news', newsController.getAll);
router.get('/news/admin', protect, authorize('ADMIN'), newsController.getAllAdmin);
router.post('/news', protect, authorize('ADMIN'), newsController.create);
router.put('/news/:id', protect, authorize('ADMIN'), newsController.update);
router.delete('/news/:id', protect, authorize('ADMIN'), newsController.delete);

// CTA Section
router.get('/cta', ctaController.get);
router.put('/cta', protect, authorize('ADMIN'), ctaController.update);

// Legalities Section
router.get('/legalities', legalitiesController.get);
router.put('/legalities', protect, authorize('ADMIN'), legalitiesController.update);

// Header Section
router.get('/header', headerController.get);
router.put('/header', protect, authorize('ADMIN'), headerController.update);

// Footer Section
router.get('/footer', footerController.get);
router.put('/footer', protect, authorize('ADMIN'), footerController.update);

// Landing Pages
router.get('/landing-pages', landingPageController.getAll);
router.get('/landing-pages/admin', protect, authorize('ADMIN'), landingPageController.getAllAdmin);
router.post('/landing-pages', protect, authorize('ADMIN'), landingPageController.create);
router.put('/landing-pages/:id', protect, authorize('ADMIN'), landingPageController.update);
router.delete('/landing-pages/:id', protect, authorize('ADMIN'), landingPageController.delete);

// Donate Page
router.get('/donate', donateController.get);
router.put('/donate', protect, authorize('ADMIN'), donateController.update);

// Impact Stats Routes
router.get('/impact-stats', impactStatsController.getAll);
router.get('/impact-stats/admin', protect, authorize('ADMIN'), impactStatsController.getAllAdmin);
router.post('/impact-stats', protect, authorize('ADMIN'), impactStatsController.create);
router.put('/impact-stats/:id', protect, authorize('ADMIN'), impactStatsController.update);
router.delete('/impact-stats/:id', protect, authorize('ADMIN'), impactStatsController.delete);

// Partners Routes
router.get('/partners', partnersController.getAll);
router.get('/partners/admin', protect, authorize('ADMIN'), partnersController.getAllAdmin);
router.post('/partners', protect, authorize('ADMIN'), partnersController.create);
router.put('/partners/:id', protect, authorize('ADMIN'), partnersController.update);
router.delete('/partners/:id', protect, authorize('ADMIN'), partnersController.delete);

// Hero Slides Routes
router.get('/hero-slides', heroSlidesController.getAll);
router.get('/hero-slides/admin', protect, authorize('ADMIN'), heroSlidesController.getAllAdmin);
router.post('/hero-slides', protect, authorize('ADMIN'), heroSlidesController.create);
router.put('/hero-slides/:id', protect, authorize('ADMIN'), heroSlidesController.update);
router.delete('/hero-slides/:id', protect, authorize('ADMIN'), heroSlidesController.delete);

// Initiatives Routes
router.get('/initiatives', initiativesController.getAll);
router.get('/initiatives/admin', protect, authorize('ADMIN'), initiativesController.getAllAdmin);
router.post('/initiatives', protect, authorize('ADMIN'), initiativesController.create);
router.put('/initiatives/:id', protect, authorize('ADMIN'), initiativesController.update);
router.delete('/initiatives/:id', protect, authorize('ADMIN'), initiativesController.delete);

module.exports = router;
