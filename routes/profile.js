const express = require('express');
const router = express.Router();
const RecipesModel = require('../models/recipe.model')
const UserModel = require('../models/user.model')
const IngredientModel = require('../models/ingredient.model');


// My-profile page
router.get('/my-profile/:userId', (req, res) => {
    UserModel.findById(req.params.userId)
        .then((currentUser) => {
            res.render('profile/my-profile.hbs', {currentUser})
        })
        .catch(() => res.redirect('/signup'))
    });

// Editing user-info
router.get('/my-profile/:userId/edit', (req, res) => {
    UserModel.findById(req.params.userId)
        .then((currentUser) => {
            res.render('profile/my-profile-edit.hbs', {currentUser});
        })
        .catch((err) =>  console.log('Some error:', err));
    });


router.post('/my-profile/:userId/edit', (req, res) => {
    const {username, email, password} = req.body
    UserModel.findByIdAndUpdate(req.params.userId, {$set: req.body})
        .then((user) => {
            res.redirect('/my-profile/' + user._id);
        })
        .catch((err) => console.log(err))
    });

router.get('/my-profile/:userId/my-shoppinglist', (req, res) => {
    res.render('profile/my-shoppinglist.hbs')
    });
    
// My recipes
router.get('/my-profile/:userId/my-recipes', (req, res) => {
    let currentUser = req.session.loggedInUser
    RecipesModel.find({user: req.params.userId})
        .then((recipes) => {
            res.render('profile/my-recipes.hbs', {recipes, currentUser});
        })
        .catch((err) => console.log(err));
    });

// My favorites
router.get('/my-profile/:userId/my-favorites', (req, res) => {
    UserModel.findById(req.params.userId) 
        .then((currentUser) => {
            res.render('profile/my-favorites.hbs', {currentUser});
        })
        .catch((err) => console.log(err));
    });

// My comments
router.get('/my-profile/:userId/my-comments', (req, res) => {
    res.render('profile/my-comments.hbs');
    });

// This route isn't necessary?! If the shoppinglist is an array, we can create a function that if a deletebutton is clicked for that item, it will remove that element of the array
// router.post('/my-profile/my-shoppinglist/', (req, res) => {

// })

// Public profile
router.get('/public-profile/:userId', (req, res) => {
    UserModel.findById(req.params.userId)
        .then((currentUser) => {
            res.render('profile/public-profile.hbs', {currentUser})
        })
        .catch((err) => console.log(err));
    });


router.get('*', (req, res) => {
    res.render('general/404.hbs')
  })
  

module.exports = router;




