const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productDetails: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pointsAwarded: {
        type: Number,
        default: 150
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Collected', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    aiRecommendation: {
        type: String,
        enum: ['SELL', 'DONATE', 'RECYCLE', 'STORE']
    },
    aiEstimatedValue: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'INR' }
    },
    aiConfidence: {
        type: Number
    },
    aiReason: {
        type: String
    },
    aiEcoImpact: {
        carbonSavedKg: { type: Number },
        ewastePreventedKg: { type: Number },
        treesEquivalent: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
