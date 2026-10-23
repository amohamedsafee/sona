// ==========================================================
// SQL Queries: Testimonials & Reviews
// ==========================================================

module.exports = {
  // Get all testimonials (Admin view)
  GET_ALL: `
    SELECT *
    FROM testimonials
    ORDER BY created_at DESC
  `,

  // Get approved testimonials (Public view)
  GET_APPROVED: `
    SELECT *
    FROM testimonials
    WHERE is_approved = 1
    ORDER BY id ASC
  `,

  // Get testimonial by ID
  GET_BY_ID: `
    SELECT *
    FROM testimonials
    WHERE id = ?
    LIMIT 1
  `,

  // Create testimonial / review
  CREATE: `
    INSERT INTO testimonials (author_name, author_title, content, rating, avatar_url, is_approved)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // Update testimonial
  UPDATE: `
    UPDATE testimonials
    SET author_name = ?,
        author_title = ?,
        content = ?,
        rating = ?,
        avatar_url = COALESCE(?, avatar_url),
        is_approved = ?
    WHERE id = ?
  `,

  // Toggle approval status
  TOGGLE_APPROVAL: `
    UPDATE testimonials
    SET is_approved = ?
    WHERE id = ?
  `,

  // Delete testimonial
  DELETE: `
    DELETE FROM testimonials
    WHERE id = ?
  `
};
