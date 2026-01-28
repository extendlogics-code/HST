const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      if (!user.is_active) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      // Update last login
      await db('users').where({ id: user.id }).update({ last_login_at: db.fn.now() });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      // Audit log
      req.user = user; // Set user for audit logger
      await auditLogger(req, 'LOGIN', 'users', user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'is_active', 'last_login_at', 'created_at');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private (Admin Only)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [userId] = await db('users').insert({
      name,
      email,
      password_hash,
      role: role || 'STAFF',
      is_active: true
    });

    await auditLogger(req, 'CREATE_USER', 'users', userId, { name, email, role });

    res.status(201).json({
      success: true,
      data: { id: userId, name, email, role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private (Admin Only)
exports.updateUser = async (req, res) => {
  const { name, email, role, is_active } = req.body;

  try {
    const user = await db('users').where({ id: req.params.id }).first();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db('users').where({ id: req.params.id }).update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      is_active: is_active !== undefined ? is_active : user.is_active
    });

    await auditLogger(req, 'UPDATE_USER', 'users', req.params.id, req.body);

    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Change user password
// @route   PATCH /api/v1/users/:id/password
// @access  Private (Admin Only)
exports.changePassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await db('users').where({ id: req.params.id }).first();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await db('users').where({ id: req.params.id }).update({ password_hash });

    await auditLogger(req, 'CHANGE_PASSWORD', 'users', req.params.id);

    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
