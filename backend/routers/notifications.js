const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// GET /api/notifications/:userId - Fetch all UNREAD notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId, isRead: false })
            .sort({ date: -1 })
            .populate('senderId', 'name');
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// PUT /api/notifications/:id/read - Mark a single notification as read
router.put('/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notification" });
    }
});

// PUT /api/notifications/read-all - Mark all notifications for a user as read
router.put('/read-all', async (req, res) => {
    try {
        const { userId } = req.body;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notifications" });
    }
});

module.exports = router;