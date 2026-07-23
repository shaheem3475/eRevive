const User = require('../models/User');
const ActivityHistory = require('../models/ActivityHistory');
const RecycleRequest = require('../models/RecycleRequest');
const DonationRequest = require('../models/DonationRequest');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const PickupRequest = require('../models/PickupRequest');
const SellDevice = require('../models/SellDevice');

const getUserProfile = async (req, res, next) => {
    try {
        const user = req.user;

        // Fetch dashboard widgets records
        const recentActivities = await ActivityHistory.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const pendingPickupsCount = await PickupRequest.countDocuments({
            user: user._id,
            status: { $in: ['Pending', 'Assigned', 'In-Transit'] }
        });

        const completedRecycleCount = await RecycleRequest.countDocuments({
            user: user._id,
            status: 'Completed'
        });

        const donationHistory = await DonationRequest.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const recycleHistory = await RecycleRequest.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const sellHistory = await SellDevice.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const pickupHistory = await PickupRequest.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const transactionHistory = await Transaction.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        const notifications = await Notification.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                profile: user,
                recentActivities,
                pendingPickupsCount,
                completedRecycleCount,
                donationHistory,
                recycleHistory,
                sellHistory,
                pickupHistory,
                transactionHistory,
                notifications
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { fullName, profileImage } = req.body;

        if (fullName) user.fullName = fullName;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        await ActivityHistory.create({
            user: user._id,
            action: 'UpdateProfile',
            details: 'Updated user personal details.'
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
