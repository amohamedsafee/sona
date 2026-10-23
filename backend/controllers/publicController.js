const db = require('../config/db');
const roomQueries = require('../queries/rooms.queries');
const serviceQueries = require('../queries/services.queries');
const blogQueries = require('../queries/blogs.queries');
const testimonialQueries = require('../queries/testimonials.queries');
const messageQueries = require('../queries/messages.queries');
const bookingQueries = require('../queries/bookings.queries');
const settingsQueries = require('../queries/settings.queries');

const generateBookingReference = () => {
  const prefix = 'BK-SONA';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${randomNum}${randomLetters}`;
};

const calculateNights = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// Public: Get rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await db.query(roomQueries.GET_FEATURED_ROOMS);
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch rooms.', error: err.message });
  }
};

// Public: Get room by ID or slug
exports.getRoomDetails = async (req, res) => {
  try {
    const { identifier } = req.params;
    let query = isNaN(identifier) ? roomQueries.GET_ROOM_BY_SLUG : roomQueries.GET_ROOM_BY_ID;
    const rooms = await db.query(query, [identifier]);

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.json({ success: true, data: rooms[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch room details.', error: err.message });
  }
};

// Public: Get services
exports.getServices = async (req, res) => {
  try {
    const services = await db.query(serviceQueries.GET_ACTIVE);
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch services.', error: err.message });
  }
};

// Public: Get blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await db.query(blogQueries.GET_PUBLISHED);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts.', error: err.message });
  }
};

// Public: Get testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await db.query(testimonialQueries.GET_APPROVED);
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials.', error: err.message });
  }
};

// Public: Submit Booking Request
exports.submitBooking = async (req, res) => {
  try {
    const {
      room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      adults = 2,
      children = 0,
      room_count = 1,
      payment_method = 'Pay at Hotel',
      special_requests = ''
    } = req.body;

    if (!guest_name || !guest_email || !guest_phone || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: Name, Email, Phone, Check-in, and Check-out dates.'
      });
    }

    // Default to first room if room_id is not specified (e.g. from homepage hero widget)
    let selectedRoomId = room_id;
    if (!selectedRoomId) {
      const defaultRooms = await db.query(roomQueries.GET_FEATURED_ROOMS);
      if (defaultRooms.length > 0) {
        selectedRoomId = defaultRooms[0].id;
      } else {
        return res.status(400).json({ success: false, message: 'No rooms currently available.' });
      }
    }

    const roomRows = await db.query(roomQueries.GET_ROOM_BY_ID, [selectedRoomId]);
    if (!roomRows || roomRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected room not found.' });
    }
    const room = roomRows[0];

    const total_nights = calculateNights(check_in, check_out);
    const count = parseInt(room_count, 10) || 1;
    const total_amount = parseFloat(room.price_per_night) * total_nights * count;
    const booking_reference = generateBookingReference();

    const result = await db.execute(bookingQueries.CREATE_BOOKING, [
      booking_reference,
      parseInt(selectedRoomId, 10),
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      parseInt(adults, 10) || 1,
      parseInt(children, 10) || 0,
      count,
      total_nights,
      total_amount,
      'pending',
      'unpaid',
      payment_method,
      special_requests
    ]);

    res.status(201).json({
      success: true,
      message: 'Reservation request received successfully! Our front desk team will contact you shortly.',
      data: {
        bookingId: result.insertId,
        reference: booking_reference,
        roomName: room.name,
        checkIn: check_in,
        checkOut: check_out,
        nights: total_nights,
        totalAmount: total_amount,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Public booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to process booking request.', error: err.message });
  }
};

// Public: Submit Contact Inquiry
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const result = await db.execute(messageQueries.CREATE, [
      name,
      email,
      subject || 'General Inquiry from Website',
      message
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent to the hotel concierge desk.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.', error: err.message });
  }
};

// Public: Get general hotel settings (name, phone, email, address)
exports.getPublicSettings = async (req, res) => {
  try {
    const rows = await db.query(settingsQueries.GET_ALL);
    const settingsMap = {};
    rows.forEach(item => {
      settingsMap[item.setting_key] = item.setting_value;
    });
    res.json({ success: true, data: settingsMap });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch hotel info.', error: err.message });
  }
};
