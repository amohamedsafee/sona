const db = require('../config/db');
const roomQueries = require('../queries/rooms.queries');
const logQueries = require('../queries/logs.queries');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await db.query(roomQueries.GET_ALL_ROOMS);
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch rooms.', error: err.message });
  }
};

// Get single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await db.query(roomQueries.GET_ROOM_BY_ID, [id]);

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.json({ success: true, data: rooms[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch room.', error: err.message });
  }
};

// Create new room
exports.createRoom = async (req, res) => {
  try {
    const {
      name,
      category = 'Deluxe',
      price_per_night,
      size_sqft = 30,
      capacity = 2,
      bed_type = 'King Beds',
      services = 'Wifi, Television, Bathroom, Air Conditioning',
      description,
      status = 'available',
      is_featured = 1,
      total_rooms = 5
    } = req.body;

    if (!name || !price_per_night) {
      return res.status(400).json({ success: false, message: 'Room name and price per night are required.' });
    }

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    let image_url = 'img/room/room-1.jpg';
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const result = await db.execute(roomQueries.CREATE_ROOM, [
      name,
      slug,
      category,
      parseFloat(price_per_night),
      parseInt(size_sqft, 10),
      parseInt(capacity, 10),
      bed_type,
      services,
      description || '',
      image_url,
      status,
      is_featured ? 1 : 0,
      parseInt(total_rooms, 10)
    ]);

    // Log action
    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'CREATE_ROOM',
        `Created room: '${name}' (ID: ${result.insertId})`,
        ip
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully.',
      data: { id: result.insertId, name, slug, price_per_night, image_url }
    });
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ success: false, message: 'Failed to create room.', error: err.message });
  }
};

// Update existing room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price_per_night,
      size_sqft,
      capacity,
      bed_type,
      services,
      description,
      status,
      is_featured,
      total_rooms
    } = req.body;

    const existingRooms = await db.query(roomQueries.GET_ROOM_BY_ID, [id]);
    if (!existingRooms || existingRooms.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }
    const current = existingRooms[0];

    const slug = name && name !== current.name ? `${slugify(name)}-${id}` : current.slug;
    let image_url = null;
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    await db.execute(roomQueries.UPDATE_ROOM, [
      name || current.name,
      slug,
      category || current.category,
      price_per_night !== undefined ? parseFloat(price_per_night) : current.price_per_night,
      size_sqft !== undefined ? parseInt(size_sqft, 10) : current.size_sqft,
      capacity !== undefined ? parseInt(capacity, 10) : current.capacity,
      bed_type || current.bed_type,
      services || current.services,
      description !== undefined ? description : current.description,
      image_url,
      status || current.status,
      is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
      total_rooms !== undefined ? parseInt(total_rooms, 10) : current.total_rooms,
      id
    ]);

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'UPDATE_ROOM',
        `Updated room details for ID: ${id} (${name || current.name})`,
        ip
      ]);
    }

    res.json({ success: true, message: 'Room updated successfully.' });
  } catch (err) {
    console.error('Update room error:', err);
    res.status(500).json({ success: false, message: 'Failed to update room.', error: err.message });
  }
};

// Quick toggle status
exports.updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'booked', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid room status.' });
    }

    await db.execute(roomQueries.UPDATE_ROOM_STATUS, [status, id]);
    res.json({ success: true, message: `Room status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status.', error: err.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.query(roomQueries.GET_ROOM_BY_ID, [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    await db.execute(roomQueries.DELETE_ROOM, [id]);

    if (req.user) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await db.query(logQueries.CREATE, [
        req.user.id,
        'DELETE_ROOM',
        `Deleted room: '${existing[0].name}' (ID: ${id})`,
        ip
      ]);
    }

    res.json({ success: true, message: 'Room deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete room.', error: err.message });
  }
};

// Room statistics
exports.getRoomStats = async (req, res) => {
  try {
    const stats = await db.query(roomQueries.GET_ROOM_STATS);
    res.json({ success: true, data: stats[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch room statistics.', error: err.message });
  }
};
