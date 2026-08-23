const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a slider title'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a slider subtitle'],
    trim: true
  },
  desc: {
    type: String,
    required: [true, 'Please add a slider description']
  },
  image: {
    type: String,
    required: [true, 'Please add a slider image URL']
  },
  btnText: {
    type: String,
    default: 'Shop Now'
  },
  link: {
    type: String,
    default: '/products'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slider', SliderSchema);
