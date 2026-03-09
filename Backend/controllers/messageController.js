const Message = require('../models/Message');

// Send message (REST API fallback)
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, gigId } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
      gig: gigId || null
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'profile.firstName profile.lastName profile.avatar')
      .populate('recipient', 'profile.firstName profile.lastName profile.avatar');

    // Emit via Socket.IO if available
    if (req.io) {
      const roomId = [req.user._id.toString(), recipientId].sort().join('_');
      req.io.to(roomId).emit('new_message', populatedMessage);
      req.io.to(recipientId).emit('new_notification', {
        type: 'message',
        message: populatedMessage
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'profile.firstName profile.lastName profile.avatar')
    .populate('recipient', 'profile.firstName profile.lastName profile.avatar')
    .populate('gig', 'title');

    // Group by conversation partner
    const conversations = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.recipient._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversations.has(partnerId)) {
        const partner = msg.sender._id.toString() === req.user._id.toString() 
          ? msg.recipient 
          : msg.sender;
        
        conversations.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: 0,
          gig: msg.gig
        });
      }

      // Count unread messages
      if (msg.recipient._id.toString() === req.user._id.toString() && !msg.read) {
        const conv = conversations.get(partnerId);
        conv.unreadCount++;
      }
    });

    // Convert to array and sort by last message date
    const result = Array.from(conversations.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('sender', 'profile.firstName profile.lastName profile.avatar')
    .populate('recipient', 'profile.firstName profile.lastName profile.avatar')
    .populate('gig', 'title')
    .populate('replyTo');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    // Notify sender that messages were read (via socket)
    if (req.io) {
      const unreadMessages = messages.filter(m => m.sender._id.toString() === userId && !m.read);
      unreadMessages.forEach(msg => {
        req.io.to(userId).emit('message_read', {
          messageId: msg._id,
          readBy: req.user._id
        });
      });
    }

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findOneAndUpdate(
      { _id: messageId, recipient: req.user._id },
      { $set: { read: true, readAt: new Date() } }
    );
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};