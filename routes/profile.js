const express = require('express')
const router = express.Router()

const UserModel = require('../models/user.model')
const IngredientModel = require('../models/ingredient.model')


router.get('/my-profile', (req, res) => {
    res.render('my-profile.hbs');
    });


   
// MUST CHECK THIS /!\/!\/!\/!\/!\/!\

// editing profile
router.post('/my-profile', (req, res) => {
    res.render('my-profile-edit.hbs');
    UserModel.findByIdAndUpdate(req.params.id, {$set: {}})
        .then(() => {
            res.render('my-profile.hbs');
        })

    });


   


router.get('/my-profile/my-recipes', (req, res) => {
    res.render('my-recipes.hbs');
    });


router.get('/my-profile/my-favorites', (req, res) => {
    res.render('my-favorites.hbs');
    });


router.get('/my-profile/my-comments', (req, res) => {
    res.render('my-comments.hbs');
    });

    

module.exports = router;
