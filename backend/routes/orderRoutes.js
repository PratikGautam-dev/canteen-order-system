const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Controllers will be implemented later
router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router; 