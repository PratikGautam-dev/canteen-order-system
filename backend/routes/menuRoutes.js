const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Controllers will be implemented later
router.get('/', menuController.getAllMenuItems);
router.post('/', menuController.addMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router; 