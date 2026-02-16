const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    weight: {
        type: Number, // in kg or lbs depending on user preference
        required: true
    },
    measurements: {
        chest: Number,
        waist: Number,
        hips: Number,
        biceps: Number,
        thighs: Number
    },
    photos: [{
        type: String // URL to the photo
    }],
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
