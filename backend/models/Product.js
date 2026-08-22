const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 0
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one product image']
  },
  shape: {
    type: String,
    enum: ['Rectangle', 'Square', 'Round', 'Aviator', 'Wayfarer', 'Cat Eye', 'Oval', 'Geometric', 'Hexagonal'],
    required: [true, 'Please select frame shape']
  },
  material: {
    type: String,
    enum: ['Metal', 'Acetate', 'TR90', 'Plastic', 'Titanium', 'Stainless Steel'],
    required: [true, 'Please select frame material']
  },
  frameType: {
    type: String,
    enum: ['Full Rim', 'Half Rim', 'Rimless'],
    required: [true, 'Please select frame type']
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    required: [true, 'Please select target gender']
  },
  color: {
    type: String,
    required: [true, 'Please specify frame color']
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Wide'],
    required: [true, 'Please select frame size']
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
