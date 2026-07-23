const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Recycle', 'Donation', 'Sell'],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In-Transit', 'Completed'],
        default: 'Pending'
    },
    assignedAgent: {
        type: String,
        default: 'Unassigned'
    }
}, { timestamps: true });

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
