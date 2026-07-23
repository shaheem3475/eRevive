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
        enum: ['Pending', 'Collected', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
