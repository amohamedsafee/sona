const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public endpoints for website guests
router.get('/rooms', publicController.getRooms);
router.get('/rooms/:identifier', publicController.getRoomDetails);
router.get('/services', publicController.getServices);
router.get('/blogs', publicController.getBlogs);
router.get('/testimonials', publicController.getTestimonials);
router.get('/settings', publicController.getPublicSettings);

// Public form submissions
router.post('/bookings', publicController.submitBooking);
router.post('/contact', publicController.submitContact);

module.exports = router;
