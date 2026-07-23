const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    ecoPoints: {
        type: Number,
        default: 500
    },
    currentTier: {
        type: String,
        default: 'Silver'
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'Recycler'],
        default: 'User'
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
