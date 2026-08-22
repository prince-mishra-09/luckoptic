const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');
const { protect, admin } = require('../middleware/auth');

// Default payment methods to seed if collection is empty
const defaultMethods = [
  { name: 'Cash on Delivery (COD)', desc: 'Pay cash upon inspecting your product delivery.', isActive: true },
  { name: 'UPI / Cards / Net Banking', desc: 'Pay online securely via PhonePe, GPay, Paytm, Cards, or Net Banking.', isActive: true }
];

// Helper to seed defaults if empty
const checkAndSeedPaymentMethods = async () => {
  try {
    const count = await PaymentMethod.countDocuments();
    if (count === 0) {
      await PaymentMethod.insertMany(defaultMethods);
      console.log('Seeded default payment methods.');
    }
  } catch (err) {
    console.error('Error seeding default payment methods:', err);
  }
};

// @desc    Get all payment methods
// @route   GET /api/payment-methods
// @access  Public (returns active by default, admin can see all)
router.get('/', async (req, res) => {
  try {
    await checkAndSeedPaymentMethods();
    
    // Check if user is requesting all (e.g. from admin panel)
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    
    const methods = await PaymentMethod.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: methods.length, methods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a payment method
// @route   POST /api/payment-methods
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json({ success: true, method });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a payment method
// @route   PUT /api/payment-methods/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let method = await PaymentMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    method = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, method });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a payment method
// @route   DELETE /api/payment-methods/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    await method.deleteOne();
    res.json({ success: true, message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
