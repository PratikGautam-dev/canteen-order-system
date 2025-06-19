const MenuItem = require('../models/MenuItem');
const path = require('path');

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, available } = req.body;
    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const item = new MenuItem({ name, description, price, available, image });
    await item.save();
    res.status(201).json({ message: 'Menu item added', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const item = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 