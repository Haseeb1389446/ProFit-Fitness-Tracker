const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                work: user.work,
                bio: user.bio,
                location: user.location,
                preferences: user.preferences,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                work: user.work,
                bio: user.bio,
                location: user.location,
                preferences: user.preferences,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



const upload = require('../middleware/uploadMiddleware');

// Upload profile picture
router.post('/upload-avatar', protect, upload.single('profilePicture'), async (req, res) => {
    if (req.file) {
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                // Store relative path or full URL. Using full URL for simplicity in frontend.
                // NOTE: In production, you might want to store relative path and prepend domain in frontend or serializer.
                // For now, constructing URL based on request.
                const protocol = req.protocol;
                const host = req.get('host');
                user.profilePicture = `${protocol}://${host}/uploads/${req.file.filename}`;
                await user.save();

                res.json({
                    imageUrl: user.profilePicture,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        work: user.work,
                        bio: user.bio,
                        location: user.location,
                        preferences: user.preferences,
                        token: generateToken(user._id)
                    }
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    const { name, profilePicture, work, bio, location, preferences, password } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = name || user.name;
        user.profilePicture = profilePicture || user.profilePicture;
        user.work = work || user.work;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.preferences = preferences || user.preferences;

        if (password) {
            user.password = password; // Pre-save hook will hash it
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            work: user.work,
            bio: user.bio,
            location: user.location,
            preferences: user.preferences,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error('Profile Update Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
