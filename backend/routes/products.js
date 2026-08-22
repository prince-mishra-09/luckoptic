const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all products with filters, sorting & search
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      gender,
      shape,
      material,
      frameType,
      minPrice,
      maxPrice,
      sort,
      featured,
      limit,
      page
    } = req.query;

    const query = {};

    // 1. Search Query (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Exact match filters
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (shape) query.shape = shape;
    if (material) query.material = material;
    if (frameType) query.frameType = frameType;
    if (featured) query.featured = featured === 'true';

    // 3. Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Sort Options
    let sortBy = { createdAt: -1 }; // Default: Newest first
    if (sort) {
      if (sort === 'priceAsc') sortBy = { price: 1 };
      else if (sort === 'priceDesc') sortBy = { price: -1 };
      else if (sort === 'ratings') sortBy = { ratings: -1 };
    }

    // 5. Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skipNum)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      },
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
