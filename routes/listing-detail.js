var express = require('express');
var router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('listing-detail', {
    title: 'Fitness Friends'
  });
});

module.exports = router;
