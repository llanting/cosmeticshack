const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('general/index');
});

router.get('*', (req, res) => {
  res.render('general/404.hbs')
})

module.exports = router;
