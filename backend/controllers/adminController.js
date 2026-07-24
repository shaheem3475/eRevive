const User = require('../models/User');
const RecycleRequest = require('../models/RecycleRequest');
const DonationRequest = require('../models/DonationRequest');
const SellDevice = require('../models/SellDevice');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');

const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDonations = await DonationRequest.countDocuments();
        const totalSellRequests = await SellDevice.countDocuments();
        const totalRecycleRequests = await RecycleRequest.countDocuments();

        // Pending Requests count across modules
        const pendingDonations = await DonationRequest.countDocuments({ status: 'Pending' });
        const pendingSells = await SellDevice.countDocuments({ status: { $in: ['Pending', 'Evaluated'] } });
        const pendingRecycles = await RecycleRequest.countDocuments({ status: 'Pending' });
        const pendingRequests = pendingDonations + pendingSells + pendingRecycles;

        // Completed Requests count across modules
        const completedDonations = await DonationRequest.countDocuments({ status: { $in: ['Completed', 'Collected'] } });
        const completedSells = await SellDevice.countDocuments({ status: 'Completed' });
        const completedRecycles = await RecycleRequest.countDocuments({ status: 'Completed' });
        const completedRequests = completedDonations + completedSells + completedRecycles;

        // Total Eco Points Awarded across all users
        const pointsAggregation = await User.aggregate([
            { $group: { _id: null, totalPoints: { $sum: '$ecoPoints' } } }
        ]);
        const totalEcoPointsAwarded = pointsAggregation.length > 0 ? pointsAggregation[0].totalPoints : 0;

        // Today's Requests count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayDonations = await DonationRequest.countDocuments({ createdAt: { $gte: todayStart } });
        const todaySells = await SellDevice.countDocuments({ createdAt: { $gte: todayStart } });
        const todayRecycles = await RecycleRequest.countDocuments({ createdAt: { $gte: todayStart } });
        const todaysRequests = todayDonations + todaySells + todayRecycles;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDonations,
                totalSellRequests,
                totalRecycleRequests,
                pendingRequests,
                completedRequests,
                totalEcoPointsAwarded,
                todaysRequests
            }
        });
    } catch (error) {
        next(error);
    }
};

// 1. User Management Controllers
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const getUserActivity = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const activities = await ActivityHistory.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        next(error);
    }
};

// 2. Donation Management Controllers
const getAllDonations = async (req, res, next) => {
    try {
        const donations = await DonationRequest.find()
            .populate('user', 'fullName email profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: donations });
    } catch (error) {
        next(error);
    }
};

const updateDonationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const donation = await DonationRequest.findById(id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation request not found' });
        }

        const oldStatus = donation.status;
        donation.status = status;
        await donation.save();

        // Award Eco Points if status is approved/collected and points not awarded yet
        if (['Collected', 'Completed', 'Approved'].includes(status) && oldStatus === 'Pending') {
            await User.findByIdAndUpdate(donation.user, { $inc: { ecoPoints: donation.pointsAwarded || 150 } });
        }

        // Generate Notification
        await Notification.create({
            user: donation.user,
            title: `Donation ${status}`,
            message: `Your donation request for "${donation.productDetails}" is now ${status}.`
        });

        // Generate Activity Log
        await ActivityHistory.create({
            user: donation.user,
            action: 'DonationStatusUpdate',
            details: `Donation status updated to ${status} by Admin.`
        });

        res.status(200).json({ success: true, message: `Donation request marked as ${status}`, data: donation });
    } catch (error) {
        next(error);
    }
};

// 3. Sell Device Management Controllers
const getAllSellRequests = async (req, res, next) => {
    try {
        const sellRequests = await SellDevice.find()
            .populate('user', 'fullName email profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: sellRequests });
    } catch (error) {
        next(error);
    }
};

const updateSellStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, offerPrice } = req.body;

        const sellItem = await SellDevice.findById(id);
        if (!sellItem) {
            return res.status(404).json({ success: false, message: 'Sell request not found' });
        }

        if (status) sellItem.status = status;
        if (offerPrice !== undefined) sellItem.finalPrice = offerPrice;
        await sellItem.save();

        // Generate Notification
        await Notification.create({
            user: sellItem.user,
            title: `Sell Evaluation Updated`,
            message: `Your sell request for "${sellItem.deviceName}" was updated to ${sellItem.status}. Offer price: $${sellItem.finalPrice}.`
        });

        // Generate Activity Log
        await ActivityHistory.create({
            user: sellItem.user,
            action: 'SellStatusUpdate',
            details: `Sell device evaluation updated to ${sellItem.status} ($${sellItem.finalPrice}) by Admin.`
        });

        res.status(200).json({ success: true, message: 'Sell request updated successfully', data: sellItem });
    } catch (error) {
        next(error);
    }
};

// 4. Recycle Management Controllers
const getAllRecycleRequests = async (req, res, next) => {
    try {
        const recycleRequests = await RecycleRequest.find()
            .populate('user', 'fullName email profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: recycleRequests });
    } catch (error) {
        next(error);
    }
};

const updateRecycleStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const recycleItem = await RecycleRequest.findById(id);
        if (!recycleItem) {
            return res.status(404).json({ success: false, message: 'Recycling request not found' });
        }

        recycleItem.status = status;
        await recycleItem.save();

        // Generate Notification
        await Notification.create({
            user: recycleItem.user,
            title: `Recycling Status: ${status}`,
            message: `Your recycling request for "${recycleItem.product}" has been updated to ${status}.`
        });

        // Generate Activity Log
        await ActivityHistory.create({
            user: recycleItem.user,
            action: 'RecycleStatusUpdate',
            details: `Recycle request status updated to ${status} by Admin.`
        });

        res.status(200).json({ success: true, message: `Recycle request marked as ${status}`, data: recycleItem });
    } catch (error) {
        next(error);
    }
};

const getAnalytics = async (req, res, next) => {
    try {
        const now = new Date();

        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);

        const monthStart = new Date(now);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);


        // === OVERVIEW METRICS ===
        const [
            dailyD, dailyS, dailyR,
            weeklyD, weeklyS, weeklyR,
            monthlyD, monthlyS, monthlyR,
            pendingD, pendingS, pendingR,
            rejectedD, rejectedS, rejectedR,
            completedD, completedS, completedR
        ] = await Promise.all([
            DonationRequest.countDocuments({ createdAt: { $gte: todayStart } }),
            SellDevice.countDocuments({ createdAt: { $gte: todayStart } }),
            RecycleRequest.countDocuments({ createdAt: { $gte: todayStart } }),
            DonationRequest.countDocuments({ createdAt: { $gte: weekStart } }),
            SellDevice.countDocuments({ createdAt: { $gte: weekStart } }),
            RecycleRequest.countDocuments({ createdAt: { $gte: weekStart } }),
            DonationRequest.countDocuments({ createdAt: { $gte: monthStart } }),
            SellDevice.countDocuments({ createdAt: { $gte: monthStart } }),
            RecycleRequest.countDocuments({ createdAt: { $gte: monthStart } }),
            DonationRequest.countDocuments({ status: 'Pending' }),
            SellDevice.countDocuments({ status: 'Pending' }),
            RecycleRequest.countDocuments({ status: 'Pending' }),
            DonationRequest.countDocuments({ status: 'Rejected' }),
            SellDevice.countDocuments({ status: 'Rejected' }),
            RecycleRequest.countDocuments({ status: 'Rejected' }),
            DonationRequest.countDocuments({ status: { $in: ['Completed', 'Collected'] } }),
            SellDevice.countDocuments({ status: { $in: ['Approved', 'Paid'] } }),
            RecycleRequest.countDocuments({ status: 'Completed' })
        ]);

        const totalEcoPointsAgg = await User.aggregate([{ $group: { _id: null, total: { $sum: '$ecoPoints' } } }]);
        const totalEcoPoints = totalEcoPointsAgg.length > 0 ? totalEcoPointsAgg[0].total : 0;

        // Average daily activity over last 30 days
        const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
        const [last30D, last30S, last30R] = await Promise.all([
            DonationRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            SellDevice.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            RecycleRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
        ]);
        const avgDailyActivity = parseFloat(((last30D + last30S + last30R) / 30).toFixed(1));

        // === MONTHLY CHART DATA (last 6 months) ===
        const monthlyPipeline = (Model) => Model.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const [monthlyDonations, monthlySells, monthlyRecycles] = await Promise.all([
            monthlyPipeline(DonationRequest),
            monthlyPipeline(SellDevice),
            monthlyPipeline(RecycleRequest)
        ]);

        // === STATUS DISTRIBUTION ===
        const approvedD = await DonationRequest.countDocuments({ status: { $in: ['Approved', 'Collected', 'Completed'] } });
        const approvedS = await SellDevice.countDocuments({ status: { $in: ['Approved', 'Paid'] } });
        const approvedR = await RecycleRequest.countDocuments({ status: { $in: ['Assigned', 'Completed'] } });

        // === ECO POINTS BY TIER ===
        const ecoByTier = await User.aggregate([
            { $group: { _id: '$currentTier', totalPoints: { $sum: '$ecoPoints' }, count: { $sum: 1 } } },
            { $sort: { totalPoints: -1 } }
        ]);

        // === TOP 10 LEADERBOARD ===
        const leaderboard = await User.aggregate([
            { $sort: { ecoPoints: -1 } },
            { $limit: 10 },
            {
                $lookup: { from: 'donationrequests', localField: '_id', foreignField: 'user', as: 'donations' }
            },
            {
                $lookup: { from: 'selldevices', localField: '_id', foreignField: 'user', as: 'sells' }
            },
            {
                $lookup: { from: 'recyclerequests', localField: '_id', foreignField: 'user', as: 'recycles' }
            },
            {
                $project: {
                    fullName: 1, email: 1, profileImage: 1, ecoPoints: 1, currentTier: 1,
                    totalDonations: { $size: '$donations' },
                    totalSells: { $size: '$sells' },
                    totalRecycles: { $size: '$recycles' }
                }
            }
        ]);

        // === RECENT ACTIVITY TIMELINE ===
        const recentActivity = await ActivityHistory.find()
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(20);

        // === QUICK INSIGHTS ===
        const [mostDonatedAgg, mostSoldAgg, avgPointsAgg, mostActiveDayAgg] = await Promise.all([
            DonationRequest.aggregate([
                { $group: { _id: '$productDetails', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 1 }
            ]),
            SellDevice.aggregate([
                { $group: { _id: '$deviceName', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 1 }
            ]),
            User.aggregate([{ $group: { _id: null, avg: { $avg: '$ecoPoints' } } }]),
            RecycleRequest.aggregate([
                { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 1 }
            ])
        ]);

        const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const totalCompleted = completedD + completedS + completedR;
        const totalRecycles = await RecycleRequest.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    dailyRequests: dailyD + dailyS + dailyR,
                    weeklyRequests: weeklyD + weeklyS + weeklyR,
                    monthlyRequests: monthlyD + monthlyS + monthlyR,
                    completedRequests: totalCompleted,
                    pendingRequests: pendingD + pendingS + pendingR,
                    rejectedRequests: rejectedD + rejectedS + rejectedR,
                    totalEcoPoints,
                    avgDailyActivity
                },
                charts: {
                    monthlyDonations,
                    monthlySells,
                    monthlyRecycles,
                    statusDistribution: {
                        pending: pendingD + pendingS + pendingR,
                        approved: approvedD + approvedS + approvedR,
                        rejected: rejectedD + rejectedS + rejectedR,
                        completed: totalCompleted
                    },
                    ecoByTier
                },
                leaderboard,
                recentActivity,
                systemHealth: {
                    mongodb: 'Connected',
                    firebase: 'Connected',
                    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not Configured',
                    backend: 'Running',
                    serverTime: now.toISOString()
                },
                insights: {
                    mostDonatedDevice: mostDonatedAgg.length > 0 ? mostDonatedAgg[0]._id : 'No data',
                    mostSoldDevice: mostSoldAgg.length > 0 ? mostSoldAgg[0]._id : 'No data',
                    avgEcoPoints: avgPointsAgg.length > 0 ? Math.round(avgPointsAgg[0].avg) : 0,
                    totalDevicesProcessed: totalCompleted,
                    carbonSavingsKg: parseFloat((totalRecycles * 12.5 * 2.5).toFixed(1)),
                    treesSaved: parseFloat((totalRecycles * 0.5).toFixed(1)),
                    mostActiveDay: mostActiveDayAgg.length > 0 ? (dayNames[mostActiveDayAgg[0]._id] || 'N/A') : 'No data'
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};

