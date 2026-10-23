const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, servicesController.getAllServices);
router.post('/', verifyToken, servicesController.createService);
router.put('/:id', verifyToken, servicesController.updateService);
router.patch('/:id/toggle', verifyToken, servicesController.toggleActive);
router.delete('/:id', verifyToken, servicesController.deleteService);

module.exports = router;
