const mongoose = require('mongoose')

let RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'name already exists'] 
    }, 
    category: {
        type: String,
        enum: ['face', 'body', 'hair'],
        required: true,
    },  
    purpose: {
        type: String,
        enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'],
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    cost: {
        type: String,
        enum: ['cheap', 'normal', 'expensive'],
        required: true
    },
    materials: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['easy', 'medium', 'difficult'],
        required: true
    },
    conservation: {
        type: String,
        required: true,
    },
    steps: {
        type: String,
        required: true,
    },
    ingedrients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingedrients', 
        required: true
    }], 
    rating: Number,
    created: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    image: {
        type: String,
        required: true,
    }}, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Recipe', RecipeSchema);

