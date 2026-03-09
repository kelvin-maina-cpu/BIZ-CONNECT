const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
} = require('../controllers/messageController');
const {
  getUnreadCount,
  deleteMessage
} = require('../controllers/messageExtrasController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread', protect, getUnreadCount);
router.get('/:userId', protect, getMessages);
router.put('/:messageId/read', protect, markAsRead);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;
