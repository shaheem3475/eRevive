const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
