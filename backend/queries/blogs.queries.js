// ==========================================================
// SQL Queries: Blog & News Articles
// ==========================================================

module.exports = {
  // Get all blog posts (Admin)
  GET_ALL: `
    SELECT *
    FROM blog_posts
    ORDER BY published_date DESC, id DESC
  `,

  // Get published blog posts (Public)
  GET_PUBLISHED: `
    SELECT *
    FROM blog_posts
    WHERE status = 'published'
    ORDER BY published_date DESC, id DESC
  `,

  // Get blog by ID
  GET_BY_ID: `
    SELECT *
    FROM blog_posts
    WHERE id = ?
    LIMIT 1
  `,

  // Get blog by slug
  GET_BY_SLUG: `
    SELECT *
    FROM blog_posts
    WHERE slug = ?
    LIMIT 1
  `,

  // Create blog post
  CREATE: `
    INSERT INTO blog_posts (title, slug, tag, author, image_url, excerpt, content, published_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Update blog post
  UPDATE: `
    UPDATE blog_posts
    SET title = ?,
        slug = ?,
        tag = ?,
        author = ?,
        image_url = COALESCE(?, image_url),
        excerpt = ?,
        content = ?,
        published_date = ?,
        status = ?
    WHERE id = ?
  `,

  // Increment views count
  INCREMENT_VIEWS: `
    UPDATE blog_posts
    SET views_count = views_count + 1
    WHERE id = ?
  `,

  // Delete blog post
  DELETE: `
    DELETE FROM blog_posts
    WHERE id = ?
  `
};
