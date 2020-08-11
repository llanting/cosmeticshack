const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
        username: { 
            type: String, 
            required: true, 
            unique: [true, 'username already exists'] 
        }, 
        usertype: { 
            type: String, 
            required: true, 
            enum: ['user', 'admin'],
            default: 'user'
        }, 
        email: { 
            type: String, 
            required: true, 
            unique: [true, 'email already exists'] 
        },
        passwordHash: { 
            type: String, 
            required: true 
        },
        favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }]
    },
    {
        timestamps: true
    }
)


 module.exports = mongoose.model('User', userSchema);
