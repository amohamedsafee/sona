const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');
const userQueries = require('../queries/users.queries');
const logQueries = require('../queries/logs.queries');

// Helper to record activity
const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    await db.query(logQueries.CREATE, [adminId, action, details, ip]);
  } catch (e) {
    console.error('Failed to log activity:', e.message);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username/email and password.' });
    }

    // Check if input is email or username
    const isEmail = usernameOrEmail.includes('@');
    const query = isEmail ? userQueries.FIND_BY_EMAIL : userQueries.FIND_BY_USERNAME;
    const users = await db.query(query, [usernameOrEmail]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    // Update last login
    await db.query(userQueries.UPDATE_LAST_LOGIN, [user.id]);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    await logActivity(user.id, 'ADMIN_LOGIN', `Admin '${user.username}' logged in successfully`, req);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
};

// Get current profile
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        avatar: req.user.avatar,
        phone: req.user.phone,
        last_login: req.user.last_login,
        created_at: req.user.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile.', error: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone } = req.body;
    let avatar = req.user.avatar;

    if (req.file) {
      avatar = `uploads/${req.file.filename}`;
    }

    await db.query(userQueries.UPDATE_PROFILE, [
      full_name || req.user.full_name,
      email || req.user.email,
      phone || req.user.phone,
      avatar,
      req.user.id
    ]);

    await logActivity(req.user.id, 'PROFILE_UPDATE', 'Updated admin profile information', req);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user.id,
        username: req.user.username,
        email: email || req.user.email,
        full_name: full_name || req.user.full_name,
        role: req.user.role,
        avatar,
        phone: phone || req.user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile.', error: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const rows = await db.query(userQueries.GET_PASSWORD_HASH, [req.user.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query(userQueries.UPDATE_PASSWORD, [newHash, req.user.id]);

    await logActivity(req.user.id, 'PASSWORD_CHANGE', 'Password successfully changed', req);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error changing password.', error: err.message });
  }
};

// Get all admins (Superadmin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query(userQueries.GET_ALL);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users.', error: err.message });
  }
};
