const mongoose = require('mongoose');

const sellDeviceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: 'Generic'
    },
    category: {
        type: String,
        default: 'Smartphone'
    },
    condition: {
        type: String,
        default: 'Good'
    },
    basePrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    defects: [{
        type: String
    }],
    customDefects: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Paid', 'Rejected'],
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

module.exports = mongoose.model('SellDevice', sellDeviceSchema);
