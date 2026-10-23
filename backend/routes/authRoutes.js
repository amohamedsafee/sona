const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public auth
router.post('/login', authController.login);

// Protected admin routes
router.get('/me', verifyToken, authController.getMe);
router.put('/profile', verifyToken, upload.single('avatar'), authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);

// Superadmin manage users
router.get('/users', verifyToken, requireRole(['superadmin']), authController.getAllUsers);

module.exports = router;
