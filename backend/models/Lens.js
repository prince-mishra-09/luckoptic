const mongoose = require('mongoose');

const LensSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a lens type name'],
    trim: true,
    unique: true
  },
  desc: {
    type: String,
    required: [true, 'Please add a lens description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price for the lens type'],
    default: 0
  },
  isPrescriptionRequired: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lens', LensSchema);
