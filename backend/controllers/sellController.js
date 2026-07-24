const SellDevice = require('../models/SellDevice');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');
const PickupRequest = require('../models/PickupRequest');
const { calculateSale } = require('../services/businessRules');

const createSellRequest = async (req, res, next) => {
    try {
        const user = req.user;
        const { deviceName, brand = 'Generic', category = 'Smartphone', condition = 'Good', defects = [], customDefects = '' } = req.body;

        if (!deviceName) {
            return res.status(400).json({ success: false, message: 'deviceName is required', errors: [] });
        }

        // Calculate offer using category & condition-based dynamic pricing engine
        const { basePrice, finalPrice, category: resolvedCat, condition: resolvedCond } = calculateSale({
            deviceName,
            category,
            condition,
            defects,
            customDefects
        });

        const sellRequest = await SellDevice.create({
            user: user._id,
            deviceName,
            brand,
            category: resolvedCat || category,
            condition: resolvedCond || condition,
            basePrice,
            finalPrice,
            defects: defects || [],
            customDefects: customDefects || '',
            status: 'Pending'
        });

        // Create notification
        await Notification.create({
            user: user._id,
            title: 'Valuation Logged!',
            message: `Evaluation of ${deviceName} locked for $${finalPrice}. Points will be credited after approval.`
        });

        // Create activity log
        await ActivityHistory.create({
            user: user._id,
            action: 'SellDevice',
            details: `Initiated valuation for ${deviceName} at $${finalPrice}.`
        });

        // Create associated PickupRequest
        await PickupRequest.create({
            user: user._id,
            type: 'Sell',
            referenceId: sellRequest._id,
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            message: 'Sell request registered successfully',
            data: sellRequest,
            pointsGained: 0
        });
    } catch (error) {
        next(error);
    }
};

const getSellHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const history = await SellDevice.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSellRequest,
    getSellHistory
};
