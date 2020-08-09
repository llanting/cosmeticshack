const express = require('express');
const router  = express.Router();
const RecipeModel = require('../models/recipe.model')

/* GET home page */
router.get('/', (req, res, next) => {
  // Now the currentuser is passed so works in the layout, but we have to add this to each page. Can we do this in another way?
  let currentUser = req.session.loggedInUser
  RecipeModel.find()
  .limit(4)
  .then((recipe) => {
    res.render('general/index.hbs', {recipe, currentUser})
  })
});


module.exports = router;
