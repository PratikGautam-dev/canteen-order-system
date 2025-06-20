const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');

// Controllers will be implemented later
router.get('/', menuController.getAllMenuItems);
router.post('/', authenticate, authorize('manager'), menuController.addMenuItem);
router.put('/:id', authenticate, authorize('manager'), menuController.updateMenuItem);
router.delete('/:id', authenticate, authorize('manager'), menuController.deleteMenuItem);

module.exports = router; 