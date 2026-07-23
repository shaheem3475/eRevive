const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, verifyAdmin, getAdminStats);

module.exports = router;
