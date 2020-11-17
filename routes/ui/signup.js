const express = require('express');
const { auth } = require('../../config');
const router = express.Router();


/* GET login listing. */
router.get('/', function(req, res, next) {
  res.render('signup', {title: 'Sign Up', maxLoginPassLength: auth.maxLoginPassLength});
});

module.exports = router;
