// ==========================================================
// SQL Queries: Bookings & Reservations
// ==========================================================

module.exports = {
  // Get all bookings with room details (Admin view)
  GET_ALL_BOOKINGS: `
    SELECT 
      b.*,
      r.name AS room_name,
      r.category AS room_category,
      r.image_url AS room_image,
      r.price_per_night AS room_unit_price
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.created_at DESC
  `,

  // Filter bookings by status
  GET_BOOKINGS_BY_STATUS: `
    SELECT 
      b.*,
      r.name AS room_name,
      r.category AS room_category,
      r.image_url AS room_image
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.status = ?
    ORDER BY b.created_at DESC
  `,

  // Get single booking by ID
  GET_BOOKING_BY_ID: `
    SELECT 
      b.*,
      r.name AS room_name,
      r.category AS room_category,
      r.image_url AS room_image,
      r.price_per_night AS room_unit_price,
      r.bed_type,
      r.services AS room_services
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.id = ?
    LIMIT 1
  `,

  // Get booking by reference code (for guests)
  GET_BOOKING_BY_REFERENCE: `
    SELECT 
      b.*,
      r.name AS room_name,
      r.category AS room_category,
      r.image_url AS room_image,
      r.price_per_night AS room_unit_price
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.booking_reference = ?
    LIMIT 1
  `,

  // Check if room is available between dates
  CHECK_ROOM_AVAILABILITY: `
    SELECT COUNT(*) AS overlapping_count
    FROM bookings
    WHERE room_id = ?
      AND status NOT IN ('cancelled', 'checked_out')
      AND (
        (check_in <= ? AND check_out >= ?) OR
        (check_in < ? AND check_out >= ?) OR
        (? <= check_in AND ? >= check_out)
      )
  `,

  // Create new booking (From front-end or admin manual booking)
  CREATE_BOOKING: `
    INSERT INTO bookings (
      booking_reference, room_id, guest_name, guest_email, guest_phone,
      check_in, check_out, adults, children, room_count, total_nights,
      total_amount, status, payment_status, payment_method, special_requests
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Update booking status
  UPDATE_BOOKING_STATUS: `
    UPDATE bookings
    SET status = ?
    WHERE id = ?
  `,

  // Update payment status
  UPDATE_PAYMENT_STATUS: `
    UPDATE bookings
    SET payment_status = ?,
        payment_method = COALESCE(?, payment_method)
    WHERE id = ?
  `,

  // Update booking details
  UPDATE_BOOKING: `
    UPDATE bookings
    SET room_id = ?,
        guest_name = ?,
        guest_email = ?,
        guest_phone = ?,
        check_in = ?,
        check_out = ?,
        adults = ?,
        children = ?,
        room_count = ?,
        total_nights = ?,
        total_amount = ?,
        status = ?,
        payment_status = ?,
        payment_method = ?,
        special_requests = ?
    WHERE id = ?
  `,

  // Delete booking
  DELETE_BOOKING: `
    DELETE FROM bookings
    WHERE id = ?
  `,

  // Get recent bookings for dashboard
  GET_RECENT_BOOKINGS: `
    SELECT 
      b.id,
      b.booking_reference,
      b.guest_name,
      b.guest_email,
      b.check_in,
      b.check_out,
      b.total_amount,
      b.status,
      b.payment_status,
      b.created_at,
      r.name AS room_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.created_at DESC
    LIMIT ?
  `
};
