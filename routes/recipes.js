const express = require('express')
const router = express.Router()
const RecipesModel = require('../models/recipe.model')

// All recipes
router.get('/all-recipes', (req, res) => {
    res.render('recipes/all-recipes.hbs')
})

// Recipe-details
router.get('/all-recipes/:id', (req, res) => {
    RecipesModel.findById(req.params.id)
        .then((recipe) => {
            res.render('recipes/recipe-details.hbs', {recipe})
        })
})

// Creating recipe
router.get('/create-recipe', (req, res) => {
    res.render('recipes/create-recipe.hbs')
})

router.post('/create-recipe', (req, res) => {
    RecipesModel.create(req.body)
        .then(() => {
            res.redirect('/all-recipes/:id')
        }).catch(() => {
            res.render('/create-recipe')
        });
})

module.exports = router;