const DonationRequest = require('../models/DonationRequest');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');
const PickupRequest = require('../models/PickupRequest');
const { uploadImage } = require('../services/cloudinaryService');

const createDonateRequest = async (req, res, next) => {
    try {
        const user = req.user;
        const { 
            productDetails, 
            image, 
            contactName, 
            phone, 
            address,
            aiRecommendation,
            aiEstimatedValue,
            aiConfidence,
            aiReason,
            aiEcoImpact
        } = req.body;

        if (!productDetails || !image || !contactName || !phone || !address) {
            return res.status(400).json({ success: false, message: 'All donation details (productDetails, image, contactName, phone, address) are required' });
        }

        // Upload image to Cloudinary (using base64 data URL string)
        const fileName = `donation_${user._id}_${Date.now()}`;
        const imageUrl = await uploadImage(image, fileName);

        const donation = await DonationRequest.create({
            user: user._id,
            productDetails,
            imageUrl,
            contactName,
            phone,
            address,
            pointsAwarded: 150,
            status: 'Pending',
            aiRecommendation,
            aiEstimatedValue,
            aiConfidence,
            aiReason,
            aiEcoImpact
        });

        // Notification
        await Notification.create({
            user: user._id,
            title: 'Donation Registered!',
            message: `Thank you for donating ${productDetails}. Eco points credited: +150.`
        });

        // Activity log
        await ActivityHistory.create({
            user: user._id,
            action: 'DonateRequest',
            details: `Registered donation request for ${productDetails}.`
        });

        // Create associated PickupRequest
        await PickupRequest.create({
            user: user._id,
            type: 'Donation',
            referenceId: donation._id,
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            message: 'Donation registered successfully',
            data: donation
        });
    } catch (error) {
        next(error);
    }
};

const getDonateHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const history = await DonationRequest.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDonateRequest,
    getDonateHistory
};
