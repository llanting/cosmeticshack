const express = require('express');
const router = express.Router();
const RecipesModel = require('../models/recipe.model')
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment-model');


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


// Delete user
router.get('/my-profile/:userId/delete', (req, res) => {
    UserModel.findByIdAndDelete(req.params.userId)
      .then(() => {
        req.session.destroy(() => res.redirect('/'))
      })
      .catch((err) => console.log(err));
  })
    
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
        .populate('favorites')
        .then((currentUser) => {
            res.render('profile/my-favorites.hbs', {currentUser});
        })
        .catch((err) => console.log(err));
    });

// My comments
router.get('/my-profile/:userId/my-comments', (req, res) => {
    let currentUser = req.params.userId
    CommentModel.find({user: req.params.userId}) 
        .populate('recipe')
        .then((comment) => {
            console.log(comment)
            res.render('profile/my-comments.hbs', {comment, currentUser});
        })
        .catch((err) => console.log(err));
    
    });

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




