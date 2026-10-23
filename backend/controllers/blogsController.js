const db = require('../config/db');
const blogQueries = require('../queries/blogs.queries');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await db.query(blogQueries.GET_ALL);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts.', error: err.message });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await db.query(blogQueries.GET_BY_ID, [id]);
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }
    res.json({ success: true, data: blogs[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog post.', error: err.message });
  }
};

// Create blog post
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      tag = 'Travel',
      author,
      excerpt = '',
      content = '',
      published_date = new Date().toISOString().slice(0, 10),
      status = 'published'
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    let image_url = 'img/blog/blog-1.jpg';
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const finalAuthor = author || (req.user ? req.user.full_name : 'Hotel Staff');

    const result = await db.execute(blogQueries.CREATE, [
      title,
      slug,
      tag,
      finalAuthor,
      image_url,
      excerpt,
      content,
      published_date,
      status
    ]);

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      data: { id: result.insertId, title, slug, image_url }
    });
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ success: false, message: 'Failed to create blog post.', error: err.message });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, author, excerpt, content, published_date, status } = req.body;

    const existing = await db.query(blogQueries.GET_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    const current = existing[0];

    let image_url = null;
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const slug = title && title !== current.title ? `${slugify(title)}-${id}` : current.slug;

    await db.execute(blogQueries.UPDATE, [
      title || current.title,
      slug,
      tag || current.tag,
      author || current.author,
      image_url,
      excerpt !== undefined ? excerpt : current.excerpt,
      content !== undefined ? content : current.content,
      published_date || current.published_date,
      status || current.status,
      id
    ]);

    res.json({ success: true, message: 'Article updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update article.', error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(blogQueries.DELETE, [id]);
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete article.', error: err.message });
  }
};
