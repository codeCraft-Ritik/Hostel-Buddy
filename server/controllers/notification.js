import Notification from '../models/notification.js';

// Get all unread notifications for the logged-in user
export const getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id, isRead: false })
            .populate('sender', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Mark all notifications as read for the logged-in user
export const markNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        return res.status(200).json({ success: true, message: "Notifications marked as read." });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};