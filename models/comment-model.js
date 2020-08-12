const mongoose = require('mongoose')

let CommentSchema = new mongoose.Schema({
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe' 
        },
        text: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // date: {
        //     type: Date, 
        //     default: Date.now
        // }
    }, 
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Comment', CommentSchema);