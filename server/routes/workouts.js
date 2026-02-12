const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { protect } = require('../middleware/authMiddleware');

// Get all workouts for logged in user
router.get('/', protect, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new workout
router.post('/', protect, async (req, res) => {
    const { activity, duration, calories, date, notes, exercises, category } = req.body;
    try {
        const workout = new Workout({
            user: req.user._id,
            activity,
            duration,
            calories,
            date,
            notes,
            exercises,
            category
        });
        const createdWorkout = await workout.save();
        res.status(201).json(createdWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete workout
router.delete('/:id', protect, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (workout) {
            if (workout.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await workout.deleteOne();
            res.json({ message: 'Workout removed' });
        } else {
            res.status(404).json({ message: 'Workout not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
