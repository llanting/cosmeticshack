const express = require('express')
const router = express.Router()
const UserModel = require('../models/user.model')
const IngredientModel = require('../models/ingredient.model')



router.get('/', (req, res) => {
  res.render('index');
});




module.exports = router;
