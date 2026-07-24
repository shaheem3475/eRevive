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
    }
}, { timestamps: true });

module.exports = mongoose.model('RecycleRequest', recycleRequestSchema);
