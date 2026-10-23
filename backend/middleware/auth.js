const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../config/db');
const userQueries = require('../queries/users.queries');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Invalid token format.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const users = await db.query(userQueries.FIND_BY_ID, [decoded.id]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'User session expired or user no longer exists.' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'User account has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session token has expired. Please sign in again.' });
    }
    return res.status(401).json({ success: false, message: 'Authentication failed. Invalid token.' });
  }
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Role '${req.user.role}' does not have sufficient permissions.` 
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
