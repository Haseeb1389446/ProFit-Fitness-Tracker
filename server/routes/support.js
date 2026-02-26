const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const SupportTicket = require('../models/SupportTicket');

// @route   POST api/support
// @desc    Create a support ticket
// @access  Private
router.post('/', protect, async (req, res) => {
    const { subject, message } = req.body;

    try {
        const newTicket = new SupportTicket({
            user: req.user.id,
            subject,
            message
        });

        const ticket = await newTicket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/support
// @desc    Get user's support tickets
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user.id }).sort({ date: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
