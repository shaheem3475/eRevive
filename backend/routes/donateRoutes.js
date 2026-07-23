const express = require('express');
const router = express.Router();
const { createDonateRequest, getDonateHistory } = require('../controllers/donateController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.post('/request', protect,
    body('productDetails').trim().isLength({ min: 2, max: 500 }).withMessage('Valid product details are required'),
    body('contactName').trim().isLength({ min: 2, max: 80 }).withMessage('A valid contact name is required'),
    body('phone').trim().matches(/^[+]?\d[\d\s-]{7,18}$/).withMessage('A valid phone number is required'),
    body('address').trim().isLength({ min: 3, max: 500 }).withMessage('A valid address is required'),
    body('image').matches(/^data:image\/(jpeg|jpg|png|webp);base64,/i).withMessage('A JPEG, JPG, PNG, or WebP image is required'), validate, createDonateRequest);
router.get('/history', protect, getDonateHistory);

module.exports = router;
