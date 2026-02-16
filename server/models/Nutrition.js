const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
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
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true
    },
    foodItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: { // e.g., "1 cup", "100g"
            type: String,
            required: true
        },
        calories: {
            type: Number,
            default: 0
        },
        protein: {
            type: Number,
            default: 0
        },
        carbs: {
            type: Number,
            default: 0
        },
        fat: {
            type: Number,
            default: 0
        }
    }],
    totalCalories: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Pre-save hook to calculate total calories if not provided
nutritionSchema.pre('save', async function () {
    if (this.foodItems && this.foodItems.length > 0) {
        this.totalCalories = this.foodItems.reduce((total, item) => total + (item.calories || 0), 0);
    }
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
