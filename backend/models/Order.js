const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  scheduledTime: {
    type: Date,
    required: false,
  },
  expectedCompletionTime: {
    type: Date,
    required: false,
  },
  duration: {
    type: Number,
    default: 30, // Duration in minutes
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for efficient schedule querying
orderSchema.index({ scheduledTime: 1, expectedCompletionTime: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema); 