const express = require('express');
const router = express.Router();
const RecipesModel = require('../models/recipe.model')
const UserModel = require('../models/user.model')
const IngredientModel = require('../models/ingredient.model')


router.get('/my-profile/my-shoppinglist', (req, res) => {
    res.render('profile/my-shoppinglist.hbs')
})

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

    

// This route isn't necessary?! If the shoppinglist is an array, we can create a function that if a deletebutton is clicked for that item, it will remove that element of the array
// router.post('/my-profile/my-shoppinglist/', (req, res) => {

// })

router.get('/public-profile', (req, res) => {
    res.render('profile/public-profile.hbs')
})


router.get('*', (req, res) => {
    res.render('general/404.hbs')
  })
  

module.exports = router;




