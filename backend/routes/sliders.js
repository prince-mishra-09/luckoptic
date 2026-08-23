const express = require('express');
const router = express.Router();
const Slider = require('../models/Slider');
const { protect, admin } = require('../middleware/auth');

// Default slides to seed if collection is empty
const defaultSliders = [
  {
    title: 'JOHN JACOBS',
    subtitle: 'ACTIVE CYCLING GLASSES',
    desc: 'Aerodynamic design with wrap-around lenses for maximum wind protection and optical clarity.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop',
    btnText: 'Explore Cycle Glasses',
    link: '/products?category=Sunglasses',
    order: 1
  },
  {
    title: 'DOCTOR RECOMMENDED',
    subtitle: 'BLUE SHIELD SCREEN PROTECT',
    desc: 'Formulated with clinical precision to block 98% harmful screen radiation. Perfect for digital eye strain.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1000&auto=format&fit=crop',
    btnText: 'Explore Blue Blockers',
    link: '/products?category=Screen%20Glasses',
    order: 2
  },
  {
    title: 'VINCENT CHASE',
    subtitle: 'THE CLINICAL COMFORT SERENE',
    desc: 'Extra lightweight frames with soft hypoallergenic nose pads. Doctor recommended for high-power prescriptions.',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop',
    btnText: 'Shop Spectacles',
    link: '/products?category=Eyeglasses',
    order: 3
  },
  {
    title: 'POLARIZED SERIES',
    subtitle: 'PREMIUM POLARIZED SUNGLASSES',
    desc: 'Eliminate glare, enhance colors, and protect your eyes under intense sunlight with our specialized polarized range.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop',
    btnText: 'Shop Polarized',
    link: '/products?category=Sunglasses',
    order: 4
  }
];

// Helper to seed defaults if empty
const checkAndSeedSliders = async () => {
  try {
    const count = await Slider.countDocuments();
    if (count === 0) {
      await Slider.insertMany(defaultSliders);
      console.log('Seeded default slider options.');
    }
  } catch (err) {
    console.error('Error seeding default sliders:', err);
  }
};

// @desc    Get all sliders
// @route   GET /api/sliders
// @access  Public
router.get('/', async (req, res) => {
  try {
    await checkAndSeedSliders();
    const sliders = await Slider.find().sort({ order: 1 });
    res.json({ success: true, count: sliders.length, sliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a slider
// @route   POST /api/sliders
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, subtitle, desc, image, btnText, link, order } = req.body;
    
    if (!subtitle || !image || !desc) {
      return res.status(400).json({ success: false, message: 'Please provide subtitle, image and description' });
    }

    const slider = await Slider.create({
      title,
      subtitle,
      desc,
      image,
      btnText,
      link,
      order: Number(order) || 0
    });
    
    res.status(201).json({ success: true, slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a slider
// @route   PUT /api/sliders/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a slider
// @route   DELETE /api/sliders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    await slider.deleteOne();
    res.json({ success: true, message: 'Slider deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
