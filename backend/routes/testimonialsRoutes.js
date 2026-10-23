const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', verifyToken, testimonialsController.getAllTestimonials);
router.post('/', verifyToken, upload.single('avatar'), testimonialsController.createTestimonial);
router.patch('/:id/toggle', verifyToken, testimonialsController.toggleApproval);
router.delete('/:id', verifyToken, testimonialsController.deleteTestimonial);

module.exports = router;
