const mongoose = require('mongoose');


const ingredientSchema = new mongoose.Schema({

        name: { 
            type: String, 
            required: true, 
            unique: [true, 'name already exists'] 
        }, 
    
    }, 
    { 
        timestamps: true 
    }   
)    



module.exports = mongoose.model('Ingredient', ingredientSchema);

