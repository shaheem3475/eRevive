const express = require('express');
const router = express.Router();
const { createSellRequest, getSellHistory } = require('../controllers/sellController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.post('/request', protect,
    body('deviceName').trim().isLength({ min: 2, max: 100 }).withMessage('A valid device name is required'),
    body('category').optional().trim(),
    body('condition').optional().trim(),
    body('brand').optional().trim(),
    body('defects').optional().isArray({ max: 4 }).withMessage('Defects must be a list'),
    body('customDefects').optional().trim().isLength({ max: 300 }).withMessage('Custom defects are too long'), validate, createSellRequest);
router.get('/history', protect, getSellHistory);

module.exports = router;
