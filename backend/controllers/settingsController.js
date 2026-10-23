const db = require('../config/db');
const settingsQueries = require('../queries/settings.queries');
const logQueries = require('../queries/logs.queries');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const rows = await db.query(settingsQueries.GET_ALL);
    // Convert array into a key-value map for easier client access
    const settingsMap = {};
    rows.forEach(item => {
      settingsMap[item.setting_key] = item.setting_value;
    });

    res.json({ success: true, data: settingsMap, raw: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings.', error: err.message });
  }
};

// Update batch settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body; // e.g. { hotel_name: '...', contact_phone: '...' }

    for (const [key, value] of Object.entries(settings)) {
      await db.execute(settingsQueries.UPSERT, [key, String(value), 'general', '']);
    }

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'SETTINGS_UPDATE',
        `Admin updated hotel settings`,
        ip
      ]);
    }

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings.', error: err.message });
  }
};
