const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.user.profile.firstName} ${socket.user.profile.lastName})`);

    // Join personal room for direct messages
    socket.join(socket.userId);

    // Notify others that user is online
    socket.broadcast.emit('user_online', {
      userId: socket.userId,
      name: `${socket.user.profile.firstName} ${socket.user.profile.lastName}`
    });

    // Handle joining a specific conversation room
    socket.on('join_conversation', (data) => {
      const { otherUserId } = data;
      // Create a unique room ID (sorted to ensure consistency)
      const roomId = [socket.userId, otherUserId].sort().join('_');
      socket.join(roomId);
      console.log(`👥 User ${socket.userId} joined room ${roomId}`);
    });

    // Handle leaving conversation
    socket.on('leave_conversation', (data) => {
      const { otherUserId } = data;
      const roomId = [socket.userId, otherUserId].sort().join('_');
      socket.leave(roomId);
      console.log(`👋 User ${socket.userId} left room ${roomId}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, gigId } = data;

        // Validate recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
          socket.emit('error', { message: 'Recipient not found' });
          return;
        }

        // Save message to database
        const message = await Message.create({
          sender: socket.userId,
          recipient: recipientId,
          content: content.trim(),
          gig: gigId || null,
          read: false
        });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'profile.firstName profile.lastName profile.avatar')
          .populate('recipient', 'profile.firstName profile.lastName profile.avatar');

        // Create room ID
        const roomId = [socket.userId, recipientId].sort().join('_');

        // Broadcast to room (both sender and recipient)
        io.to(roomId).emit('new_message', populatedMessage);

        // Also send to recipient's personal room (in case they're not in the conversation room)
        io.to(recipientId).emit('new_notification', {
          type: 'message',
          message: populatedMessage,
          sender: {
            _id: socket.userId,
            name: `${socket.user.profile.firstName} ${socket.user.profile.lastName}`,
            avatar: socket.user.profile.avatar
          }
        });

        // Update unread count for recipient
        const unreadCount = await Message.countDocuments({
          recipient: recipientId,
          sender: socket.userId,
          read: false
        });

        io.to(recipientId).emit('unread_count_update', {
          senderId: socket.userId,
          count: unreadCount
        });

        console.log(`📨 Message sent from ${socket.userId} to ${recipientId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { recipientId } = data;
      const roomId = [socket.userId, recipientId].sort().join('_');
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        name: `${socket.user.profile.firstName} ${socket.user.profile.lastName}`,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { recipientId } = data;
      const roomId = [socket.userId, recipientId].sort().join('_');
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        name: `${socket.user.profile.firstName} ${socket.user.profile.lastName}`,
        isTyping: false
      });
    });

    // Handle message read status
    socket.on('mark_read', async (data) => {
      try {
        const { messageId, senderId } = data;
        
        await Message.findByIdAndUpdate(messageId, { read: true });
        
        // Notify sender that message was read
        io.to(senderId).emit('message_read', {
          messageId,
          readBy: socket.userId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.userId} (${reason})`);
      
      // Notify others that user is offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId
      });
    });
  });
};
