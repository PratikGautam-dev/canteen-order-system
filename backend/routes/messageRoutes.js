const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get chat history for an order
router.get('/chat/:orderId', messageController.getChatHistory);

// Mark messages as read
router.put('/read/:orderId/:userId', messageController.markAsRead);

// Get unread message count
router.get('/unread/:userId', messageController.getUnreadCount);

module.exports = router; 