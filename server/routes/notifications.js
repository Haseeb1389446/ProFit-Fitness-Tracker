const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ date: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).json({ msg: 'Notification not found' });

        // Make sure user owns notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { $set: { read: true } },
            { new: true }
        );

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).json({ msg: 'Notification not found' });

        // Make sure user owns notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Notification.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Notification removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
