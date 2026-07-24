const mongoose = require('mongoose');

const recycleRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: String,
        required: true
    },
    isPickup: {
        type: Boolean,
        default: true
    },
    coordinates: {
        type: String,
        default: ''
    },
    distance: {
        type: Number,
        default: 0
    },
    pickupCharge: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    scheduledDate: {
        type: Date
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

module.exports = mongoose.model('RecycleRequest', recycleRequestSchema);
