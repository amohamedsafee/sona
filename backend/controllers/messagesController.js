const db = require('../config/db');
const messageQueries = require('../queries/messages.queries');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await db.query(messageQueries.GET_ALL);
    const unread = await db.query(messageQueries.COUNT_UNREAD);
    res.json({
      success: true,
      data: messages,
      unreadCount: unread[0]?.unread_count || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.', error: err.message });
  }
};

// Get single message
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await db.query(messageQueries.GET_BY_ID, [id]);
    if (!messages || messages.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const message = messages[0];
    // Auto-mark as read if unread
    if (message.status === 'unread') {
      await db.execute(messageQueries.UPDATE_STATUS, ['read', null, id]);
      message.status = 'read';
    }

    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch message.', error: err.message });
  }
};

// Update message status / add reply notes
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply_notes } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await db.execute(messageQueries.UPDATE_STATUS, [status, reply_notes || null, id]);
    res.json({ success: true, message: `Message status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update message status.', error: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(messageQueries.DELETE, [id]);
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete message.', error: err.message });
  }
};
