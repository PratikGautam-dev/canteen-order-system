const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

// Get chat history for an order
router.get('/chat/:orderId', authenticate, messageController.getChatHistory);

// Mark messages as read
router.put('/read/:orderId/:userId', authenticate, messageController.markAsRead);

// Get unread message count
router.get('/unread/:userId', authenticate, messageController.getUnreadCount);

module.exports = router; 