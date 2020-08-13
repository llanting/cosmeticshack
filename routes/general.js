const express = require('express');
const router  = express.Router();
const RecipeModel = require('../models/recipe.model')

/* GET home page */
router.get('/', (req, res, next) => {
  let currentUser = req.session.loggedInUser
  RecipeModel.find()
  .limit(3)
  .then((recipe) => {
    res.render('general/index.hbs', {recipe, currentUser})
  })
});


module.exports = router;
