const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- Analytics Endpoints ---
exports.getSalesStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemDetails',
        },
      },
      { $unwind: '$menuItemDetails' },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ['$items.quantity', '$menuItemDetails.price'] } },
        },
      },
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].revenue : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error getting sales stats', error: err.message });
  }
};

exports.getPopularItems = async (req, res) => {
  try {
    const popular = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalOrdered: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItemDetails',
        },
      },
      { $unwind: '$menuItemDetails' },
      {
        $project: {
          _id: 0,
          name: '$menuItemDetails.name',
          totalOrdered: 1,
        },
      },
    ]);
    res.json(popular);
  } catch (err) {
    res.status(500).json({ message: 'Error getting popular items', error: err.message });
  }
};

exports.getPeakOrderTimes = async (req, res) => {
  try {
    const peakTimes = await Order.aggregate([
      {
        $group: {
          _id: { $hour: '$scheduledTime' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);
    res.json(peakTimes);
  } catch (err) {
    res.status(500).json({ message: 'Error getting peak order times', error: err.message });
  }
};
// --- End Analytics ---

exports.createOrder = async (req, res) => {
  try {
    const { user, items, scheduledTime } = req.body;
    if (!user || !items || !scheduledTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const order = new Order({ user, items, scheduledTime });
    await order.save();
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 