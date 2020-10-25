const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth } = require('../../config');
const UserModel = require('../../models/userModel');
const router = express.Router();


/* POST signup */
router.post('/', async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email.trim() || !password.trim() || email.length > auth.maxLoginPassLength || password.length > auth.maxLoginPassLength) {
    return next(createError(401)); // Unauthorized
  }

  try {
    const salt = await bcrypt.genSalt(auth.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new UserModel({email: email, hash: hash});
    const user = await newUser.save();
    res.status(200).end();
  } catch (err) {
    if (err.code === 11000){
      err.status = 401;
      err.message = 'email already in use';
    }
    if (err.errors){
      err.status = 401;
      err.message = 'empty email or passord field';
    }
    next(err);
  }
});

module.exports = router;
