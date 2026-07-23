const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cost: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        default: ''
    },
    couponCodePrefix: {
        type: String,
        default: 'EV'
    }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
