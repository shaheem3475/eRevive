const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityHistory = require('../models/ActivityHistory');

const registerUser = async (req, res, next) => {
    try {
        const { fullName, profileImage } = req.body;
        const verifiedUser = req.user;

        if (!fullName) {
            return res.status(400).json({ success: false, message: 'fullName is required', errors: [] });
        }

        verifiedUser.fullName = fullName;
        if (profileImage) verifiedUser.profileImage = profileImage;
        await verifiedUser.save();
        const user = verifiedUser;

        // Generate welcome notification
        const hasWelcomeNotification = await Notification.exists({ user: user._id, title: 'Welcome to eRevive!' });
        if (!hasWelcomeNotification) await Notification.create({
            user: user._id,
            title: 'Welcome to eRevive!',
            message: `Hi ${fullName}, welcome to your dashboard. Start recycling to earn points!`
        });

        // Record signup event
        if (!hasWelcomeNotification) await ActivityHistory.create({
            user: user._id,
            action: 'Register',
            details: 'Created full-stack account profile.'
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully in database',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        // req.user is set by authMiddleware
        const user = req.user;
        
        await ActivityHistory.create({
            user: user._id,
            action: 'Login',
            details: 'User authenticated and logged into app console.'
        });

        res.status(200).json({
            success: true,
            message: 'Login session registered',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const user = req.user;

        await ActivityHistory.create({
            user: user._id,
            action: 'Logout',
            details: 'User logged out and closed session.'
        });

        res.status(200).json({
            success: true,
            message: 'Logout registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
