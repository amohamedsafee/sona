// ==========================================================
// SQL Queries: Activity Audit Logs
// ==========================================================

module.exports = {
  // Insert activity log
  CREATE: `
    INSERT INTO activity_logs (admin_id, action, details, ip_address)
    VALUES (?, ?, ?, ?)
  `,

  // Get recent activity logs
  GET_RECENT: `
    SELECT 
      l.id,
      l.action,
      l.details,
      l.ip_address,
      l.created_at,
      a.username,
      a.full_name,
      a.role
    FROM activity_logs l
    LEFT JOIN admins a ON l.admin_id = a.id
    ORDER BY l.created_at DESC
    LIMIT ?
  `
};
