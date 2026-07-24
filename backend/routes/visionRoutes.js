const express = require('express');
const router = express.Router();
const { analyzeDevice } = require('../controllers/visionController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/vision/analyze
 * @desc    Analyze uploaded e-waste device image using Google Gemini Vision
 * @access  Private (Authenticated Users)
 */
router.post('/analyze', protect, analyzeDevice);

module.exports = router;
