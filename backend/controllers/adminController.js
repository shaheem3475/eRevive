const User = require('../models/User');
const RecycleRequest = require('../models/RecycleRequest');
const DonationRequest = require('../models/DonationRequest');
const SellDevice = require('../models/SellDevice');

const getAdminStats = async (req, res, next) => {
    try {
        const user = req.user;

        const totalUsers = await User.countDocuments();
        const totalRecycleRequests = await RecycleRequest.countDocuments();
        const totalDonationRequests = await DonationRequest.countDocuments();
        const totalSellRequests = await SellDevice.countDocuments();

        // Calculate total e-waste weight estimates (mock calculation based on requests)
        const totalRecycledWeight = totalRecycleRequests * 12.5; // average 12.5kg per request
        const totalCarbonOffset = totalRecycledWeight * 2.5; // average 2.5kg CO2 offset per kg recycled

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRecycleRequests,
                totalDonationRequests,
                totalSellRequests,
                totalRecycledWeight,
                totalCarbonOffset
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats
};
