const express       = require('express');
const router        = express.Router();
const RecipesModel  = require('../models/recipe.model');
const UserModel     = require('../models/user.model');
const IngredientModel = require('../models/ingredient.model');
const moment        = require('moment');
const uploader      = require('../config/cloudinary');

// All recipes
router.get('/all-recipes', (req, res) => {
    let currentUser = req.session.loggedInUser;
    RecipesModel.find()
        .then((recipe) => {
            res.render('recipes/all-recipes.hbs', {recipe, currentUser})
        })
        .catch((err) => console.log(err));
    });

// Recipe-details
router.get('/all-recipes/:recipeId', (req, res) => {
    let currentUser = req.session.loggedInUser;
    RecipesModel.findById(req.params.recipeId)
        // To insert user-info, next to id
        .populate('user')
        .then((recipe) => {
            // Changes recipe.date to a readable format
            let newDate = moment(recipe.date).format("MMMM DD, YYYY");
    

                if (recipe.level == "easy"){  

                    if (recipe.cost == "low"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg'})
                    } else if (recipe.cost == "medium"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg'})
                    } else if (recipe.cost == "high"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg'})
                    }

                } else if (recipe.level == "medium"){
                    if (recipe.cost == "low"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg'})
                    } else if (recipe.cost == "medium"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg'})
                    } else if (recipe.cost == "high"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg'})
                    }


                } else if (recipe.level == "hard"){
                    if (recipe.cost == "low"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg'})
                    } else if (recipe.cost == "medium"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg'})
                    } else if (recipe.cost == "high"){
                        res.render('recipes/recipe-details.hbs', {recipe, date: newDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg'})
                    }

                }  

            })

             
            .catch((err) => console.log(err))  
        .catch((err) => console.log(err))
    });

// Creating recipe
router.get('/create-recipe', (req, res) => {
    let currentUser = req.session.loggedInUser;
    IngredientModel.find()
    .then((ingredients) => {
        res.render('recipes/create-recipe.hbs', {ingredients, currentUser})
    })
    .catch((err)=>{
        console.log("error is", err)
    })
})


router.post('/create-recipe', uploader.single("imageUrl"), (req, res) => {
    const {name, category, time, cost, materials, level, purpose, conservation, steps, imageUrl, ingredients} = req.body;
    
    if(!name || !category || !purpose || !time || !cost || !materials || !level || !conservation || !steps || !ingredients){
      res.status(500).render('recipes/create-recipe.hbs', {errorMessage: 'Please fill in all fields'})
      return;
    }

    // Pics don't load onto cloudinary
    console.log('file is: ', imageUrl)
    //This should come after. Doesn't work
    //res.json({image: req.file.path })

    RecipesModel.create(req.body)
        .then((createdRecipe) => {
            //Here we have to update the .image to the value of the imageUrl!
            RecipesModel.findByIdAndUpdate(createdRecipe._id, {$push: {user: req.session.loggedInUser._id}})
                .then((recipe) => {
                    res.redirect('/all-recipes/' + recipe._id);
                    UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {recipes: [recipe]}})
                        .then(() => console.log('succes'))
                        .catch((err) =>  console.log(err));
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err));
});

// Edit and delete my recipes
router.get('/my-profile/my-recipes/:recipeId/edit', (req, res) => {
    let currentUser = req.session.loggedInUser
    RecipesModel.findById(req.params.recipeId)
        .then((recipe) => {
            res.render('recipes/edit-recipe.hbs', {recipe, currentUser})
        })
    });

router.post('/my-profile/my-recipes/:recipeId/edit', (req, res) => {
    RecipesModel.findByIdAndUpdate(req.params.recipeId, {$set: req.body})
        .then((recipe) => {
            res.redirect('/all-recipes/' + recipe._id)
        }).catch((err) => {
            console.log(err)
            // res.render('recipes/edit-recipe.hbs')
        });
    });

router.post('/my-profile/my-recipes/:recipeId/delete', (req, res) => {
    RecipesModel.findByIdAndDelete(req.params.recipeId)
        .then(() => {
            res.redirect('/my-profile/' + req.session.loggedInUser._id + '/my-recipes')
        })
        .catch((err) => console.log(err))
    });

// Favorite button route
router.post('/my-recipes/my-favorites/:recipeId', (req, res) => {
    RecipesModel.findById(req.params.recipeId)
        .then((recipe) => {
            //Pushes new recipe into favorites. But doesn't check for duplicates!
            UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {favorites: [recipe]}})
                .then(() => {
                    res.redirect('/all-recipes')
                }).catch((err) =>  console.log(err));
        }).catch((err) =>  console.log(err));
    });

module.exports = router;