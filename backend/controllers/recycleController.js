const RecycleRequest = require('../models/RecycleRequest');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');
const PickupRequest = require('../models/PickupRequest');
const { calculatePickup } = require('../services/businessRules');

const createRecycleRequest = async (req, res, next) => {
    try {
        const user = req.user;
        const { 
            product, 
            isPickup = true, 
            coordinates,
            aiRecommendation,
            aiEstimatedValue,
            aiConfidence,
            aiReason,
            aiEcoImpact
        } = req.body;

        if (!product) {
            return res.status(400).json({ success: false, message: 'product details are required' });
        }

        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 1); // Set for tomorrow

        const pickupDetails = calculatePickup(coordinates, isPickup);
        const pickupCharge = pickupDetails.pickupCharge;
        const recycleRequest = await RecycleRequest.create({
            user: user._id,
            product,
            isPickup,
            ...pickupDetails,
            status: 'Pending',
            scheduledDate,
            aiRecommendation,
            aiEstimatedValue,
            aiConfidence,
            aiReason,
            aiEcoImpact
        });

        // Notification
        await Notification.create({
            user: user._id,
            title: 'Recycling Schedule Logged!',
            message: isPickup 
                ? `Certified collection pickup booked for ${product}. Charge: ₹${pickupCharge}.`
                : `Drop-off receipt generated for ${product}.`
        });

        // Activity Log
        await ActivityHistory.create({
            user: user._id,
            action: 'RecycleRequest',
            details: `Registered recycling request for ${product}.`
        });

        // Create PickupRequest if pickup mode is active
        if (isPickup) {
            await PickupRequest.create({
                user: user._id,
                type: 'Recycle',
                referenceId: recycleRequest._id,
                status: 'Pending'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Recycle request logged successfully',
            data: recycleRequest
        });
    } catch (error) {
        next(error);
    }
};

const getRecycleHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const history = await RecycleRequest.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecycleRequest,
    getRecycleHistory
};
