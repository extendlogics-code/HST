const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getInitiatives, 
  getAllInitiativesAdmin, 
  createInitiative, 
  updateInitiative, 
  deleteInitiative,
  uploadInitiativeImage
} = require('../controllers/initiativeController');
const { protect, authorize } = require('../middleware/auth');

// Multer config for initiative images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/initiatives/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'initiative-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});

// Public route
router.get('/', getInitiatives);

// Admin routes
router.get('/admin', protect, authorize('ADMIN'), getAllInitiativesAdmin);
router.post('/', protect, authorize('ADMIN'), createInitiative);
router.put('/:id', protect, authorize('ADMIN'), updateInitiative);
router.delete('/:id', protect, authorize('ADMIN'), deleteInitiative);
router.post('/upload', protect, authorize('ADMIN'), upload.single('image'), uploadInitiativeImage);

module.exports = router;
