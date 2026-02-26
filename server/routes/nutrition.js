const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const { protect } = require('../middleware/authMiddleware');

// Get all nutrition logs for the user with search and filter
router.get('/', protect, async (req, res) => {
    try {
        const { search, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        if (search) {
            query.$or = [
                { mealType: { $regex: search, $options: 'i' } },
                { 'foodItems.name': { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const logs = await Nutrition.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new nutrition log
router.post('/', protect, async (req, res) => {
    const { date, mealType, foodItems } = req.body;

    try {
        const newLog = new Nutrition({
            user: req.user.id,
            date,
            mealType,
            foodItems
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a nutrition log
router.delete('/:id', protect, async (req, res) => {
    try {
        const log = await Nutrition.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log not found' });
        }

        // Check user
        if (log.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await log.deleteOne();

        res.json({ msg: 'Log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
