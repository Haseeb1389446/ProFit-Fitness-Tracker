const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        type: String, // Kept for backward compatibility or general name
        required: true
    },
    exercises: [{
        name: {
            type: String,
            required: true
        },
        sets: {
            type: Number,
            default: 1
        },
        reps: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number, // in kg or lbs
            default: 0
        },
        notes: String
    }],
    category: {
        type: String,
        enum: ['Strength', 'Cardio', 'Flexibility', 'Other'],
        default: 'Other'
    },
    tags: [String],
    duration: {
        type: Number, // in minutes
        required: true
    },
    calories: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
