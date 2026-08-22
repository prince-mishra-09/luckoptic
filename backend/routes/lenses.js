const express = require('express');
const router = express.Router();
const Lens = require('../models/Lens');
const { protect, admin } = require('../middleware/auth');

// Default lenses to seed if collection is empty
const defaultLenses = [
  { name: 'Zero Power', desc: 'Anti-Glare / Screen Protect', price: 0, isPrescriptionRequired: false },
  { name: 'Single Vision', desc: 'Distance or Reading power', price: 500, isPrescriptionRequired: true },
  { name: 'Bifocal/Progressive', desc: 'Dual power prescription', price: 1000, isPrescriptionRequired: true }
];

// Helper to seed defaults if empty
const checkAndSeedLenses = async () => {
  try {
    const count = await Lens.countDocuments();
    if (count === 0) {
      await Lens.insertMany(defaultLenses);
      console.log('Seeded default lens options.');
    }
  } catch (err) {
    console.error('Error seeding default lenses:', err);
  }
};

// @desc    Get all lens types
// @route   GET /api/lenses
// @access  Public
router.get('/', async (req, res) => {
  try {
    await checkAndSeedLenses();
    const lenses = await Lens.find().sort({ price: 1 });
    res.json({ success: true, count: lenses.length, lenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a lens type
// @route   POST /api/lenses
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const lens = await Lens.create(req.body);
    res.status(201).json({ success: true, lens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a lens type
// @route   PUT /api/lenses/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let lens = await Lens.findById(req.params.id);
    if (!lens) {
      return res.status(404).json({ success: false, message: 'Lens option not found' });
    }

    lens = await Lens.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, lens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a lens type
// @route   DELETE /api/lenses/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const lens = await Lens.findById(req.params.id);
    if (!lens) {
      return res.status(404).json({ success: false, message: 'Lens option not found' });
    }

    await lens.deleteOne();
    res.json({ success: true, message: 'Lens option deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
