const mongoose = require('mongoose');

const EyePrescriptionSchema = new mongoose.Schema({
  sphere: { type: String, default: '' },
  cylinder: { type: String, default: '' },
  axis: { type: String, default: '' },
  add: { type: String, default: '' }
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  leftEye: EyePrescriptionSchema,
  rightEye: EyePrescriptionSchema,
  pupilDistance: { type: String, default: '' },
  lensType: { type: String, default: '' }
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  hasPrescription: {
    type: Boolean,
    default: false
  },
  prescription: PrescriptionSchema
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery (COD)'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
