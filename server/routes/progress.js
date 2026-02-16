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
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
