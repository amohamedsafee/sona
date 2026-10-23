// ==========================================================
// SQL Queries: Admin Users & Authentication
// ==========================================================

module.exports = {
  // Find admin by email for login
  FIND_BY_EMAIL: `
    SELECT id, username, email, password_hash, full_name, role, avatar, phone, is_active, last_login, created_at
    FROM admins
    WHERE email = ? AND is_active = 1
    LIMIT 1
  `,

  // Find admin by username
  FIND_BY_USERNAME: `
    SELECT id, username, email, password_hash, full_name, role, avatar, phone, is_active, last_login, created_at
    FROM admins
    WHERE username = ? AND is_active = 1
    LIMIT 1
  `,

  // Find admin by ID
  FIND_BY_ID: `
    SELECT id, username, email, full_name, role, avatar, phone, is_active, last_login, created_at
    FROM admins
    WHERE id = ?
    LIMIT 1
  `,

  // Update last login timestamp
  UPDATE_LAST_LOGIN: `
    UPDATE admins
    SET last_login = NOW()
    WHERE id = ?
  `,

  // Update admin profile
  UPDATE_PROFILE: `
    UPDATE admins
    SET full_name = ?, email = ?, phone = ?, avatar = COALESCE(?, avatar)
    WHERE id = ?
  `,

  // Get current password hash for verification
  GET_PASSWORD_HASH: `
    SELECT password_hash FROM admins WHERE id = ?
  `,

  // Update admin password
  UPDATE_PASSWORD: `
    UPDATE admins
    SET password_hash = ?
    WHERE id = ?
  `,

  // Get all administrators
  GET_ALL: `
    SELECT id, username, email, full_name, role, avatar, phone, is_active, last_login, created_at
    FROM admins
    ORDER BY created_at DESC
  `,

  // Create new staff / admin user
  CREATE: `
    INSERT INTO admins (username, email, password_hash, full_name, role, phone, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `,

  // Toggle active status
  TOGGLE_STATUS: `
    UPDATE admins
    SET is_active = ?
    WHERE id = ?
  `,

  // Delete admin
  DELETE: `
    DELETE FROM admins
    WHERE id = ?
  `
};
