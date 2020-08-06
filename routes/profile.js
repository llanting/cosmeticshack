const express = require('express');
const router = express.Router();
const RecipesModel = require('../models/recipe.model')
//const UserModel = require('../models/user.model.js')


router.get('/my-profile/my-shoppinglist', (req, res) => {
    res.render('profile/my-shoppinglist.hbs')
})

// This route isn't necessary?! If the shoppinglist is an array, we can create a function that if a deletebutton is clicked for that item, it will remove that element of the array
// router.post('/my-profile/my-shoppinglist/', (req, res) => {

// })

router.get('/public-profile', (req, res) => {
    res.render('profile/public-profile.hbs')
})

// ROUTES FOR EDIT AND DELETE RECIPE (on userpage so you know for sure user can only edit/delete his/her own recipes)
router.get('/my-profile/my-recipes/:id/edit', (req, res) => {
    RecipesModel.findById(req.params.id)
        .then((recipe) => {
            res.render('recipes/edit-recipe.hbs', {recipe})
        })
})

router.post('/my-profile/my-recipes/:id/edit', (req, res) => {
    RecipesModel.findByIdAndUpdate(req.params.id, {$set: req.body})
        .then(() => {
            res.redirect('/all-recipes/:id')
        }).catch(() => {
            res.render('recipes/edit-recipe.hbs')
        });
})

router.post('/my-profile/my-recipes/:id/delete', (req, res) => {
    RecipesModel.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/my-profile/my-recipes')
        })
})



module.exports = router;