const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect,
    body('fullName').optional().trim().isLength({ min: 2, max: 80 }).withMessage('A valid full name is required'),
    body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL'), validate, updateUserProfile);

module.exports = router;
