const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a payment method name'],
    trim: true,
    unique: true
  },
  desc: {
    type: String,
    required: [true, 'Please add a description']
  },
  qrCode: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
