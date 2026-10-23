const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin room management
router.get('/', verifyToken, roomsController.getAllRooms);
router.get('/stats', verifyToken, roomsController.getRoomStats);
router.get('/:id', verifyToken, roomsController.getRoomById);
router.post('/', verifyToken, upload.single('image'), roomsController.createRoom);
router.put('/:id', verifyToken, upload.single('image'), roomsController.updateRoom);
router.patch('/:id/status', verifyToken, roomsController.updateRoomStatus);
router.delete('/:id', verifyToken, roomsController.deleteRoom);

module.exports = router;
