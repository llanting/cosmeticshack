const express = require('express');
const router = express.Router();
const RecipesModel = require('../models/recipe.model')
const UserModel = require('../models/user.model')
const IngredientModel = require('../models/ingredient.model')

// How to change this one to my-profile/:id? I figured out the logic, but don't know how to get the link to work on the navbar (pass the user to the layout)
router.get('/my-profile', (req, res) => {
    if (req.session.loggedInUser) {
        res.render('profile/my-profile.hbs', {currentUser: req.session.loggedInUser})
    }
    else {
        res.redirect('/signin')
    }
});

router.get('/my-profile/:userId/edit', (req, res) => {
    UserModel.findById(req.params.userId)
        .then((currentUser) => {
            res.render('profile/my-profile-edit.hbs', {currentUser});
        }).catch((err) => {
            console.log('Some error:', err)
        });
});

router.post('/my-profile/:userId/edit', (req, res) => {
    UserModel.findByIdAndUpdate(req.params.userId, {$set: req.body})
        .then(() => {
            res.redirect('/my-profile');
        })
        .catch((err) => {
            console.log(err)
        })
});

// I want to make :userId links of these to, but the problem lies in the navbar. I can't seem to do href="my-profile/{{user.id}}/my-favorites"
router.get('/my-profile/my-shoppinglist', (req, res) => {
    res.render('profile/my-shoppinglist.hbs')
})
    

router.get('/my-profile/my-recipes', (req, res) => {
    // Get recipes with the user:id as my id
    // Insert profile-id if added to the route
    RecipesModel.find({user: req.session.loggedInUser._id})
        .then((myRecipes) => {
            console.log(myRecipes)
            res.render('profile/my-recipes.hbs', {myRecipes});
        }).catch((err) => console.log(err));
});


router.get('/my-profile/my-favorites', (req, res) => {
    UserModel.findById(req.session.loggedInUser._id) 
        .then((myRecipes) => {
            res.render('profile/my-favorites.hbs', {myRecipes});
        }).catch((err) => {
            console.log(err)
        })
});


router.get('/my-profile/my-comments', (req, res) => {
    res.render('profile/my-comments.hbs');
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




