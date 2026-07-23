const express = require('express');
const router = express.Router();
const { getRedeemableRewards, redeemReward } = require('../controllers/rewardsController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.get('/', protect, getRedeemableRewards);
router.post('/redeem', protect, body('rewardId').isMongoId().withMessage('A valid reward is required'), validate, redeemReward);

module.exports = router;
