const Notification = require('../models/Notification');

const getNotifications = async (req, res, next) => {
    try {
        const user = req.user;
        const list = await Notification.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: list });
    } catch (error) {
        next(error);
    }
};

const markNotificationsRead = async (req, res, next) => {
    try {
        const user = req.user;
        await Notification.updateMany({ user: user._id, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markNotificationsRead
};
