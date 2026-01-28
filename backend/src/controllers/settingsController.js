const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config for settings assets
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/settings';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
});

exports.uploadAsset = upload.single('asset');

// @desc    Get trust settings
// @route   GET /api/v1/settings/trust
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    const settings = await db('trust_settings').first();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update trust settings
// @route   PUT /api/v1/settings/trust
// @access  Private (Admin Only)
exports.updateSettings = async (req, res) => {
  try {
    const settings = await db('trust_settings').first();
    if (!settings) {
      return res.status(404).json({ success: false, error: 'Settings not found' });
    }
    
    await db('trust_settings').where({ id: settings.id }).update(req.body);
    const updated = await db('trust_settings').first();
    
    await auditLogger(req, 'UPDATE_SETTINGS', 'trust_settings', settings.id, req.body);
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update signature asset
// @route   POST /api/v1/settings/assets/signature
// @access  Private (Admin Only)
exports.updateSignature = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const settings = await db('trust_settings').first();
    if (!settings) return res.status(404).json({ success: false, error: 'Settings not found' });

    const signature_image_url = `uploads/settings/${req.file.filename}`;
    await db('trust_settings').where({ id: settings.id }).update({ signature_image_url });

    await auditLogger(req, 'UPDATE_SIGNATURE', 'trust_settings', settings.id);

    res.json({ success: true, data: { signature_image_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update seal asset
// @route   POST /api/v1/settings/assets/seal
// @access  Private (Admin Only)
exports.updateSeal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const settings = await db('trust_settings').first();
    if (!settings) return res.status(404).json({ success: false, error: 'Settings not found' });

    const seal_image_url = `uploads/settings/${req.file.filename}`;
    await db('trust_settings').where({ id: settings.id }).update({ seal_image_url });

    await auditLogger(req, 'UPDATE_SEAL', 'trust_settings', settings.id);

    res.json({ success: true, data: { seal_image_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update logo asset
// @route   POST /api/v1/settings/assets/logo
// @access  Private (Admin Only)
exports.updateLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const settings = await db('trust_settings').first();
    if (!settings) return res.status(404).json({ success: false, error: 'Settings not found' });

    const logo_image_url = `uploads/settings/${req.file.filename}`;
    await db('trust_settings').where({ id: settings.id }).update({ logo_image_url });

    await auditLogger(req, 'UPDATE_LOGO', 'trust_settings', settings.id);

    res.json({ success: true, data: { logo_image_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
