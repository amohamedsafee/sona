// ==========================================================
// SQL Queries: Hotel General Settings
// ==========================================================

module.exports = {
  // Get all hotel settings
  GET_ALL: `
    SELECT setting_key, setting_value, group_name, description, updated_at
    FROM hotel_settings
    ORDER BY group_name ASC, setting_key ASC
  `,

  // Get single setting by key
  GET_BY_KEY: `
    SELECT setting_key, setting_value
    FROM hotel_settings
    WHERE setting_key = ?
    LIMIT 1
  `,

  // Upsert setting
  UPSERT: `
    INSERT INTO hotel_settings (setting_key, setting_value, group_name, description)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      setting_value = VALUES(setting_value),
      updated_at = CURRENT_TIMESTAMP
  `,

  // Update setting value
  UPDATE: `
    UPDATE hotel_settings
    SET setting_value = ?
    WHERE setting_key = ?
  `
};
