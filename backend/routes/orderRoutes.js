const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validateScheduling = require('../middleware/scheduleValidation');

// Protected routes
router.get('/', authenticate, authorize('manager'), orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.post('/', authenticate, validateScheduling, orderController.createOrder);
router.put('/:id', authenticate, validateScheduling, authorize('manager'), orderController.updateOrder);
router.delete('/:id', authenticate, authorize('manager'), orderController.deleteOrder);

// Analytics routes
router.get('/analytics/sales', authenticate, authorize('manager'), orderController.getSalesStats);
router.get('/analytics/popular', authenticate, authorize('manager'), orderController.getPopularItems);

// Managers: get all orders, update, delete
router.get('/analytics/peak', authenticate, authorize('manager'), orderController.getPeakOrderTimes);

module.exports = router; 