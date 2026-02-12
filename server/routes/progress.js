const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');

// Get all progress logs
router.get('/', protect, async (req, res) => {
    try {
        const logs = await Progress.find({ user: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new progress log
router.post('/', protect, async (req, res) => {
    const { date, weight, measurements, notes } = req.body;

    try {
        const newLog = new Progress({
            user: req.user.id,
            date,
            weight,
            measurements,
            notes
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
