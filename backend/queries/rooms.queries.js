// ==========================================================
// SQL Queries: Rooms & Accommodations
// ==========================================================

module.exports = {
  // Get all rooms (Admin view)
  GET_ALL_ROOMS: `
    SELECT r.*,
      (SELECT COUNT(*) FROM bookings b WHERE b.room_id = r.id AND b.status IN ('confirmed', 'checked_in')) AS active_bookings_count
    FROM rooms r
    ORDER BY r.id ASC
  `,

  // Get active/featured rooms (Public & Admin filter)
  GET_FEATURED_ROOMS: `
    SELECT *
    FROM rooms
    WHERE is_featured = 1 AND status = 'available'
    ORDER BY id ASC
  `,

  // Get single room by ID
  GET_ROOM_BY_ID: `
    SELECT *
    FROM rooms
    WHERE id = ?
    LIMIT 1
  `,

  // Get single room by slug
  GET_ROOM_BY_SLUG: `
    SELECT *
    FROM rooms
    WHERE slug = ?
    LIMIT 1
  `,

  // Search/Filter rooms with availability
  SEARCH_ROOMS: `
    SELECT *
    FROM rooms
    WHERE status = 'available'
      AND capacity >= ?
    ORDER BY price_per_night ASC
  `,

  // Insert new room
  CREATE_ROOM: `
    INSERT INTO rooms (
      name, slug, category, price_per_night, size_sqft, capacity,
      bed_type, services, description, image_url, status, is_featured, total_rooms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Update existing room
  UPDATE_ROOM: `
    UPDATE rooms
    SET name = ?,
        slug = ?,
        category = ?,
        price_per_night = ?,
        size_sqft = ?,
        capacity = ?,
        bed_type = ?,
        services = ?,
        description = ?,
        image_url = COALESCE(?, image_url),
        status = ?,
        is_featured = ?,
        total_rooms = ?
    WHERE id = ?
  `,

  // Quick toggle room status (available, booked, maintenance)
  UPDATE_ROOM_STATUS: `
    UPDATE rooms
    SET status = ?
    WHERE id = ?
  `,

  // Delete room
  DELETE_ROOM: `
    DELETE FROM rooms
    WHERE id = ?
  `,

  // Room overview stats for cards
  GET_ROOM_STATS: `
    SELECT 
      COUNT(*) AS total_rooms_count,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_count,
      SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) AS booked_count,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance_count,
      AVG(price_per_night) AS average_price
    FROM rooms
  `
};
