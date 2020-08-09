const mongoose = require('mongoose');


const ingredientSchema = new mongoose.Schema({

        name: { 
            type: String, 
            required: true, 
            unique: [true, 'name already exists'] 
        }, 
        image: { 
            type: String, 
            required: true, 
        },
        cost: { 
            type: String, 
            enum: ['low', 'medium', 'high'], 
            required: true 
        }, 
        purpose: { 
            type: String, 
            enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'], 
            required: true 
        }
    }, 
    { 
        timestamps: true 
    }   
)    

let ingredients = 


{
    name: { 
        type: String, 
        required: true, 
        unique: [true, 'name already exists'] 
    }, 
    image: { 
        type: String, 
        required: true, 
    },
    cost: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        required: true 
    }, 
    purpose: { 
        type: String, 
        enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'], 
        required: true 
    }
}, 
{ 
    timestamps: true 
},



module.exports = mongoose.model('Ingredient', ingredientSchema);

