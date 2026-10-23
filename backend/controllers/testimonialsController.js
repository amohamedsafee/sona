const db = require('../config/db');
const testimonialQueries = require('../queries/testimonials.queries');

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await db.query(testimonialQueries.GET_ALL);
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials.', error: err.message });
  }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { author_name, author_title = 'Guest', content, rating = 5.0, is_approved = 1 } = req.body;

    if (!author_name || !content) {
      return res.status(400).json({ success: false, message: 'Author name and review content are required.' });
    }

    let avatar_url = 'img/room/avatar/avatar-1.jpg';
    if (req.file) {
      avatar_url = `uploads/${req.file.filename}`;
    }

    const result = await db.execute(testimonialQueries.CREATE, [
      author_name,
      author_title,
      content,
      parseFloat(rating),
      avatar_url,
      is_approved ? 1 : 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      data: { id: result.insertId, author_name, rating }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create testimonial.', error: err.message });
  }
};

// Toggle approval
exports.toggleApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;
    await db.execute(testimonialQueries.TOGGLE_APPROVAL, [is_approved ? 1 : 0, id]);
    res.json({ success: true, message: `Review approval status updated.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle review approval.', error: err.message });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(testimonialQueries.DELETE, [id]);
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete review.', error: err.message });
  }
};
