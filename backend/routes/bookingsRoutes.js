const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, bookingsController.getAllBookings);
router.get('/:id', verifyToken, bookingsController.getBookingById);
router.post('/', verifyToken, bookingsController.createBooking);
router.put('/:id', verifyToken, bookingsController.updateBooking);
router.patch('/:id/status', verifyToken, bookingsController.updateBookingStatus);
router.patch('/:id/payment', verifyToken, bookingsController.updatePaymentStatus);
router.delete('/:id', verifyToken, bookingsController.deleteBooking);

module.exports = router;
