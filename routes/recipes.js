const express = require('express')
const router = express.Router()
const RecipesModel = require('../models/recipe.model')

// All recipes
router.get('/all-recipes', (req, res) => {
    RecipesModel.find()
        .then((recipe) => {
            res.render('recipes/all-recipes.hbs', {recipe})
        })
})

// Recipe-details
router.get('/all-recipes/:recipeId', (req, res) => {
    RecipesModel.findById(req.params.recipeId)
        .then((recipe) => {
            res.render('recipes/recipe-details.hbs', {recipe})
        })
        .catch((err) => {
            console.log(err)
    })
})

// Creating recipe
router.get('/create-recipe', (req, res) => {
    res.render('recipes/create-recipe.hbs')
})

router.post('/create-recipe', (req, res) => {
    const {name, category, time, cost, materials, level, conservation, steps, image, ingredients} = req.body
    
    if(!name || !category || !time || !cost || !materials || !level || !conservation || !steps){
      res.status(500).render('recipes/create-recipe.hbs', {errorMessage: 'Please fill in all fields'})
      return;
    }

    RecipesModel.create(req.body)
        .then((recipe) => {
            res.redirect('/all-recipes/' + recipe._id)
        }).catch((err) => {
            console.log(err)
            res.render('recipes/create-recipe.hbs')
        });
})

// Edit and delete recipe
router.get('/my-profile/my-recipes/:id/edit', (req, res) => {
    RecipesModel.findById(req.params.id)
        .then((recipe) => {
            res.render('recipes/edit-recipe.hbs', {recipe})
        })
})

router.post('/my-profile/my-recipes/:id/edit', (req, res) => {
    RecipesModel.findByIdAndUpdate(req.params.id, {$set: req.body})
        .then((recipe) => {
            res.redirect('/all-recipes/' + recipe._id)
        }).catch((err) => {
            console.log(err)
            // res.render('recipes/edit-recipe.hbs')
        });
})

router.post('/my-profile/my-recipes/:id/delete', (req, res) => {
    RecipesModel.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/my-profile/my-recipes')
        })
})

// Test for adding favorite button
router.post('/my-recipes/my-favorites/:id', (req, res) => {
    RecipesModel.findById(req.params.id)
        .then((result) => {
            
        }).catch((err) => {
            
        });
})

module.exports = router;