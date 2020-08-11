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
            type: mongoose.Schema.Types.Mixed,
            enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'],
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        cost: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        materials: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
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
        ingredients: [{
            type: mongoose.Schema.Types.String,
            required: true
        }],

        rating: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date, 
            default: Date.now
        },
        image: {
            type: String,
            required: true,
            default: '/images/defaultimg.jpeg'
        }
    }, 
    {
        timestamps: true
    }
)










module.exports = mongoose.model('Recipe', RecipeSchema);

