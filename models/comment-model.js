const mongoose = require('mongoose')

let CommentSchema = new mongoose.Schema({
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe' 
        },
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date, 
            default: Date.now
        },
        rating: {
            type: Number,
            required: true
        }
    }, 
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Comment', CommentSchema);