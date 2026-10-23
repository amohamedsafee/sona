const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, messagesController.getAllMessages);
router.get('/:id', verifyToken, messagesController.getMessageById);
router.patch('/:id/status', verifyToken, messagesController.updateMessageStatus);
router.delete('/:id', verifyToken, messagesController.deleteMessage);

module.exports = router;
