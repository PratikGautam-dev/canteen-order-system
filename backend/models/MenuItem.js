const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String, // URL or file path
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema); 