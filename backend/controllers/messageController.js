const Message = require('../models/Message');

// Get chat history for a specific order
exports.getChatHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const messages = await Message.find({ orderId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat history', error: err.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { orderId, userId } = req.params;
    await Message.updateMany(
      { orderId, receiver: userId, read: false },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking messages as read', error: err.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Message.countDocuments({ receiver: userId, read: false });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Error getting unread count', error: err.message });
  }
}; 