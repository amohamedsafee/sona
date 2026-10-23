const db = require('../config/db');
const serviceQueries = require('../queries/services.queries');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await db.query(serviceQueries.GET_ALL);
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch services.', error: err.message });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    const { title, description, icon_class = 'flaticon-036-parking', is_active = 1, display_order = 0 } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const result = await db.execute(serviceQueries.CREATE, [
      title,
      description,
      icon_class,
      is_active ? 1 : 0,
      parseInt(display_order, 10) || 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: { id: result.insertId, title, description, icon_class }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create service.', error: err.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon_class, is_active, display_order } = req.body;

    const existing = await db.query(serviceQueries.GET_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    const current = existing[0];

    await db.execute(serviceQueries.UPDATE, [
      title || current.title,
      description || current.description,
      icon_class || current.icon_class,
      is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
      display_order !== undefined ? parseInt(display_order, 10) : current.display_order,
      id
    ]);

    res.json({ success: true, message: 'Service updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update service.', error: err.message });
  }
};

// Toggle active
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    await db.execute(serviceQueries.TOGGLE_ACTIVE, [is_active ? 1 : 0, id]);
    res.json({ success: true, message: 'Service status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update service status.', error: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(serviceQueries.DELETE, [id]);
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete service.', error: err.message });
  }
};
