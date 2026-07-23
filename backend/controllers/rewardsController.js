const Reward = require('../models/Reward');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');

const DEFAULT_REWARDS = [
    { name: 'Amazon Gift Card', cost: 200, description: 'INR 100 cashback coupon', couponCodePrefix: 'AZ' },
    { name: 'Zomato Food Coupon', cost: 100, description: 'INR 50 off meals', couponCodePrefix: 'ZO' },
    { name: 'Uber Ride Discount', cost: 150, description: 'INR 75 off ride fees', couponCodePrefix: 'UB' },
    { name: 'Tree Plantation Card', cost: 100, description: 'Plant 1 Tree', couponCodePrefix: 'TR' }
];

const ensureRewards = () => Promise.all(DEFAULT_REWARDS.map(reward => Reward.updateOne(
    { name: reward.name }, { $setOnInsert: reward }, { upsert: true }
)));

const getRedeemableRewards = async (req, res, next) => {
    try {
        await ensureRewards();
        const rewards = await Reward.find({}).sort({ cost: 1 });
        res.status(200).json({ success: true, message: 'Rewards retrieved', data: rewards });
    } catch (error) { next(error); }
};

const redeemReward = async (req, res, next) => {
    try {
        const reward = await Reward.findById(req.body.rewardId);
        if (!reward) return res.status(404).json({ success: false, message: 'Reward not found', errors: [] });
        const user = await User.findOneAndUpdate(
            { _id: req.user._id, ecoPoints: { $gte: reward.cost } },
            { $inc: { ecoPoints: -reward.cost } }, { new: true }
        );
        if (!user) return res.status(400).json({ success: false, message: 'Insufficient Eco Points balance', errors: [] });

        const code = `${reward.couponCodePrefix}-${Date.now().toString(36).toUpperCase()}-${user._id.toString().slice(-5).toUpperCase()}`;
        await Transaction.create({ user: user._id, type: 'Debit', amount: reward.cost, description: `Redeemed reward: ${reward.name}`, code, reward: reward._id });
        await Notification.create({ user: user._id, title: 'Voucher Redeemed!', message: `Exchanged ${reward.cost} points for ${reward.name}. Code: ${code}` });
        await ActivityHistory.create({ user: user._id, action: 'RedeemReward', details: `Redeemed ${reward.name} for ${reward.cost} Eco Points.` });
        res.status(200).json({ success: true, message: 'Reward redeemed successfully', data: { code, ecoPoints: user.ecoPoints } });
    } catch (error) { next(error); }
};

module.exports = { getRedeemableRewards, redeemReward, ensureRewards };
