const Message = require('../models/Message');

// Get unread message count (total + per sender)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });

    const breakdown = await Message.aggregate([
      { $match: { recipient: req.user._id, read: false } },
      { $group: { _id: '$sender', count: { $sum: 1 } } }
    ]);

    res.json({ total: count, breakdown });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a message (sender only)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.content = '[deleted]';
    message.deleted = true;
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
