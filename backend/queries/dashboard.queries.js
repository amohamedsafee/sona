// ==========================================================
// SQL Queries: Executive Dashboard Analytics & KPIs
// ==========================================================

module.exports = {
  // Top KPI summary numbers
  GET_KPI_SUMMARY: `
    SELECT
      (SELECT COUNT(*) FROM bookings) AS total_bookings,
      (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE payment_status = 'paid') AS total_revenue,
      (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pending_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'checked_in') AS currently_occupied_rooms,
      (SELECT COUNT(*) FROM rooms WHERE status = 'available') AS available_rooms,
      (SELECT COUNT(*) FROM rooms) AS total_rooms,
      (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread') AS unread_inquiries
  `,

  // Bookings grouped by status
  GET_BOOKING_STATUS_COUNTS: `
    SELECT 
      status,
      COUNT(*) AS count
    FROM bookings
    GROUP BY status
  `,

  // Last 6 months revenue for charts
  GET_MONTHLY_REVENUE: `
    SELECT 
      DATE_FORMAT(created_at, '%b %Y') AS month_label,
      YEAR(created_at) AS year_num,
      MONTH(created_at) AS month_num,
      COALESCE(SUM(total_amount), 0) AS revenue,
      COUNT(*) AS bookings_count
    FROM bookings
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b %Y')
    ORDER BY year_num ASC, month_num ASC
  `,

  // Occupancy rate calculation
  GET_OCCUPANCY_STATS: `
    SELECT
      (SELECT COUNT(*) FROM rooms) AS total_rooms,
      (SELECT COUNT(*) FROM rooms WHERE status = 'available') AS available_rooms,
      (SELECT COUNT(*) FROM bookings WHERE status = 'checked_in') AS active_checked_in,
      ROUND(
        (SELECT COUNT(*) FROM bookings WHERE status = 'checked_in') / 
        GREATEST((SELECT COUNT(*) FROM rooms), 1) * 100, 
        1
      ) AS occupancy_percentage
  `,

  // Recent bookings table
  GET_LATEST_BOOKINGS: `
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
    LIMIT 6
  `,

  // Recent inquiries table
  GET_LATEST_INQUIRIES: `
    SELECT id, name, email, subject, message, status, created_at
    FROM contact_messages
    ORDER BY created_at DESC
    LIMIT 5
  `
};
