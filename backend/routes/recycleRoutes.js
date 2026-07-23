const express = require('express');
const router = express.Router();
const { createRecycleRequest, getRecycleHistory } = require('../controllers/recycleController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.post('/request', protect,
    body('product').trim().isLength({ min: 2, max: 500 }).withMessage('Valid product details are required'),
    body('isPickup').optional().isBoolean().withMessage('Pickup selection must be boolean'),
    body('coordinates').optional().trim().isLength({ max: 60 }).withMessage('Coordinates are invalid'), validate, createRecycleRequest);
router.get('/history', protect, getRecycleHistory);

module.exports = router;
