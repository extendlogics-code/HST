const express = require('express');
const router = express.Router();
const { 
  login, 
  getMe, 
  getUsers, 
  createUser, 
  updateUser, 
  changePassword 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);

// User management (Admin only)
router.get('/users', protect, authorize('ADMIN'), getUsers);
router.post('/users', protect, authorize('ADMIN'), createUser);
router.patch('/users/:id', protect, authorize('ADMIN'), updateUser);
router.patch('/users/:id/password', protect, authorize('ADMIN'), changePassword);

module.exports = router;
