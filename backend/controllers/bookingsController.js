const db = require('../config/db');
const bookingQueries = require('../queries/bookings.queries');
const roomQueries = require('../queries/rooms.queries');
const logQueries = require('../queries/logs.queries');

// Helper to generate unique booking reference
const generateBookingReference = () => {
  const prefix = 'BK-SONA';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${randomNum}${randomLetters}`;
};

// Calculate nights between two YYYY-MM-DD dates
const calculateNights = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = bookingQueries.GET_ALL_BOOKINGS;
    let params = [];

    if (status && status !== 'all') {
      query = bookingQueries.GET_BOOKINGS_BY_STATUS;
      params = [status];
    }

    let bookings = await db.query(query, params);

    // Optional text search filter
    if (search && search.trim() !== '') {
      const s = search.toLowerCase();
      bookings = bookings.filter(b => 
        b.booking_reference.toLowerCase().includes(s) ||
        b.guest_name.toLowerCase().includes(s) ||
        b.guest_email.toLowerCase().includes(s) ||
        (b.room_name && b.room_name.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings.', error: err.message });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await db.query(bookingQueries.GET_BOOKING_BY_ID, [id]);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, data: bookings[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking details.', error: err.message });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      adults = 1,
      children = 0,
      room_count = 1,
      payment_method = 'Pay at Hotel',
      special_requests = '',
      status = 'pending',
      payment_status = 'unpaid'
    } = req.body;

    if (!room_id || !guest_name || !guest_email || !guest_phone || !check_in || !check_out) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: room_id, guest_name, guest_email, guest_phone, check_in, and check_out.' 
      });
    }

    // Verify room exists
    const roomRows = await db.query(roomQueries.GET_ROOM_BY_ID, [room_id]);
    if (!roomRows || roomRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected room not found.' });
    }
    const room = roomRows[0];

    // Calculate nights & amount
    const total_nights = calculateNights(check_in, check_out);
    const roomPrice = parseFloat(room.price_per_night);
    const count = parseInt(room_count, 10) || 1;
    const total_amount = roomPrice * total_nights * count;

    const booking_reference = generateBookingReference();

    const result = await db.execute(bookingQueries.CREATE_BOOKING, [
      booking_reference,
      parseInt(room_id, 10),
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
      status,
      payment_status,
      payment_method,
      special_requests || ''
    ]);

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'CREATE_BOOKING',
        `Admin created booking ${booking_reference} for ${guest_name} (${room.name})`,
        ip
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: {
        id: result.insertId,
        booking_reference,
        room_name: room.name,
        total_nights,
        total_amount,
        status,
        payment_status
      }
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to create booking.', error: err.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = await db.query(bookingQueries.GET_BOOKING_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    await db.execute(bookingQueries.UPDATE_BOOKING_STATUS, [status, id]);

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'UPDATE_BOOKING_STATUS',
        `Changed booking ${existing[0].booking_reference} status to '${status}'`,
        ip
      ]);
    }

    res.json({ success: true, message: `Booking status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status.', error: err.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;

    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];
    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status.' });
    }

    await db.execute(bookingQueries.UPDATE_PAYMENT_STATUS, [payment_status, payment_method || null, id]);
    res.json({ success: true, message: `Payment status updated to ${payment_status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update payment status.', error: err.message });
  }
};

// Update booking details
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      adults,
      children,
      room_count,
      status,
      payment_status,
      payment_method,
      special_requests
    } = req.body;

    const existing = await db.query(bookingQueries.GET_BOOKING_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    const current = existing[0];

    const finalRoomId = room_id ? parseInt(room_id, 10) : current.room_id;
    const finalCheckIn = check_in || current.check_in;
    const finalCheckOut = check_out || current.check_out;
    const finalRoomCount = room_count ? parseInt(room_count, 10) : current.room_count;

    // Recalculate amount if dates or room changed
    const nights = calculateNights(finalCheckIn, finalCheckOut);
    const roomRows = await db.query(roomQueries.GET_ROOM_BY_ID, [finalRoomId]);
    const pricePerNight = roomRows.length > 0 ? parseFloat(roomRows[0].price_per_night) : parseFloat(current.room_unit_price);
    const totalAmount = pricePerNight * nights * finalRoomCount;

    await db.execute(bookingQueries.UPDATE_BOOKING, [
      finalRoomId,
      guest_name || current.guest_name,
      guest_email || current.guest_email,
      guest_phone || current.guest_phone,
      finalCheckIn,
      finalCheckOut,
      adults !== undefined ? parseInt(adults, 10) : current.adults,
      children !== undefined ? parseInt(children, 10) : current.children,
      finalRoomCount,
      nights,
      totalAmount,
      status || current.status,
      payment_status || current.payment_status,
      payment_method || current.payment_method,
      special_requests !== undefined ? special_requests : current.special_requests,
      id
    ]);

    res.json({ success: true, message: 'Booking updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update booking.', error: err.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.query(bookingQueries.GET_BOOKING_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    await db.execute(bookingQueries.DELETE_BOOKING, [id]);

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'DELETE_BOOKING',
        `Deleted booking reference: ${existing[0].booking_reference}`,
        ip
      ]);
    }

    res.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete booking.', error: err.message });
  }
};
