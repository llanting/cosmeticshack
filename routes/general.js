const express = require('express');
const router  = express.Router();
const RecipeModel = require('../models/recipe.model')

/* GET home page */
// Or set four recipes on HTML
router.get('/', (req, res, next) => {
  RecipeModel.find()
  .then((recipe) => {
    res.render('general/index.hbs', {recipe})
  })
});


module.exports = router;
