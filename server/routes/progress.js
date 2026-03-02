const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');

// Get all progress logs
router.get('/', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { user: req.user.id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const logs = await Progress.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new progress log
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('photos', 5), async (req, res) => {
    const { date, weight, measurements, notes } = req.body;

    try {
        let photoUrls = [];
        if (req.files) {
            photoUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        }

        // Parse measurements if sent as string (from FormData)
        let parsedMeasurements = measurements;
        if (typeof measurements === 'string') {
            try {
                parsedMeasurements = JSON.parse(measurements);
            } catch (e) {
                // If not valid JSON, might be empty or invalid, ignore or handle
                parsedMeasurements = {};
            }
        }

        const newLog = new Progress({
            user: req.user.id,
            date,
            weight,
            measurements: parsedMeasurements,
            photos: photoUrls,
            notes
        });

        const log = await newLog.save();

        // Create a notification for the progress update
        const Notification = require('../models/Notification');
        await Notification.create({
            user: req.user.id,
            type: 'goal',
            message: `Great job updating your progress! Current weight: ${weight} kg.`
        });

        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
