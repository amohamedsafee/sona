const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, settingsController.getAllSettings);
router.post('/', verifyToken, settingsController.updateSettings);

module.exports = router;
