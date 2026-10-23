// ==========================================================
// SQL Queries: Contact Messages & Inquiries
// ==========================================================

module.exports = {
  // Get all contact messages
  GET_ALL: `
    SELECT *
    FROM contact_messages
    ORDER BY created_at DESC
  `,

  // Get message by ID
  GET_BY_ID: `
    SELECT *
    FROM contact_messages
    WHERE id = ?
    LIMIT 1
  `,

  // Create new contact message
  CREATE: `
    INSERT INTO contact_messages (name, email, subject, message, status)
    VALUES (?, ?, ?, ?, 'unread')
  `,

  // Update message status
  UPDATE_STATUS: `
    UPDATE contact_messages
    SET status = ?,
        reply_notes = COALESCE(?, reply_notes)
    WHERE id = ?
  `,

  // Delete message
  DELETE: `
    DELETE FROM contact_messages
    WHERE id = ?
  `,

  // Count unread messages
  COUNT_UNREAD: `
    SELECT COUNT(*) AS unread_count
    FROM contact_messages
    WHERE status = 'unread'
  `
};
