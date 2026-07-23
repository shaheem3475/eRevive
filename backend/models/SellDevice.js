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
        enum: ['Pending', 'Approved', 'Paid'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('SellDevice', sellDeviceSchema);
