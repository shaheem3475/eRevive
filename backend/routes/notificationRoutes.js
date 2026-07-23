const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read', protect, markNotificationsRead);

module.exports = router;
