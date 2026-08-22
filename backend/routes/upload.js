const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect, admin } = require('../middleware/auth');

// @desc    Get ImageKit auth parameters for client-side uploads
// @route   GET /api/upload/auth
// @access  Private (Registered Users/Admins)
router.get('/auth', protect, (req, res) => {
  try {
    const token = req.query.token || crypto.randomBytes(16).toString('hex');
    const expire = req.query.expire || Math.floor(Date.now() / 1000) + 1800; // 30 minutes expiry

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return res.status(500).json({
        success: false,
        message: 'ImageKit private key is missing on the server'
      });
    }

    // Generate HMAC-SHA1 signature of (token + expire) with privateKey
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    res.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
