const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    getUserActivity,
    getAllDonations,
    updateDonationStatus,
    getAllSellRequests,
    updateSellStatus,
    getAllRecycleRequests,
    updateRecycleStatus,
    getAnalytics
} = require('../controllers/adminController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protect, verifyAdmin, getAdminStats);
router.get('/dashboard', protect, verifyAdmin, getAdminStats);

// Analytics
router.get('/analytics', protect, verifyAdmin, getAnalytics);

// User Management Routes
router.get('/users', protect, verifyAdmin, getAllUsers);
router.get('/users/:userId/activity', protect, verifyAdmin, getUserActivity);

// Donation Management Routes
router.get('/donations', protect, verifyAdmin, getAllDonations);
router.put('/donations/:id/status', protect, verifyAdmin, updateDonationStatus);

// Sell Device Management Routes
router.get('/sell', protect, verifyAdmin, getAllSellRequests);
router.put('/sell/:id/status', protect, verifyAdmin, updateSellStatus);

// Recycle Management Routes
router.get('/recycle', protect, verifyAdmin, getAllRecycleRequests);
router.put('/recycle/:id/status', protect, verifyAdmin, updateRecycleStatus);

module.exports = router;
