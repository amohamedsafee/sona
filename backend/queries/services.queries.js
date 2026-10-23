// ==========================================================
// SQL Queries: Hotel Services & Amenities
// ==========================================================

module.exports = {
  // Get all services
  GET_ALL: `
    SELECT *
    FROM services
    ORDER BY display_order ASC, id ASC
  `,

  // Get active services (Public)
  GET_ACTIVE: `
    SELECT *
    FROM services
    WHERE is_active = 1
    ORDER BY display_order ASC, id ASC
  `,

  // Get single service by ID
  GET_BY_ID: `
    SELECT *
    FROM services
    WHERE id = ?
    LIMIT 1
  `,

  // Create service
  CREATE: `
    INSERT INTO services (title, description, icon_class, is_active, display_order)
    VALUES (?, ?, ?, ?, ?)
  `,

  // Update service
  UPDATE: `
    UPDATE services
    SET title = ?,
        description = ?,
        icon_class = ?,
        is_active = ?,
        display_order = ?
    WHERE id = ?
  `,

  // Toggle active status
  TOGGLE_ACTIVE: `
    UPDATE services
    SET is_active = ?
    WHERE id = ?
  `,

  // Delete service
  DELETE: `
    DELETE FROM services
    WHERE id = ?
  `
};
