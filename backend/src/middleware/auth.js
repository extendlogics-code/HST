const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await db('users')
        .where({ id: decoded.id })
        .first()
        .select('id', 'name', 'email', 'role', 'is_active');

      if (!req.user || !req.user.is_active) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found or inactive' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

const optionalProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await db('users')
        .where({ id: decoded.id })
        .first()
        .select('id', 'name', 'email', 'role', 'is_active');
    } catch (error) {
      console.error('Optional Auth Error:', error.message);
    }
  }
  next();
};

module.exports = { protect, authorize, optionalProtect };
