// https://tools.ietf.org/html/rfc7519
// https://pragmaticwebsecurity.com/files/cheatsheets/jwt.pdf
const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth } = require('../../config');

const UserModel = require('../../models/userModel');

const router = express.Router();


/* POST login */
router.post('/', async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email.trim() || !password.trim() || email.length > auth.maxLoginPassLength || password.length > auth.maxLoginPassLength) {
    return next(createError(401)); // Unauthorized
  }

  // check secret by loading app
  try {
    // db.getUserByEmail
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const salt = await bcrypt.genSalt(auth.saltRounds);
    const hash = await bcrypt.hash(password, salt);

    var newUserModel = new UserModel(
      {
        email: email,
        password: hash,
      });

    const entity = await newUserModel.save();

    try {
      const userEmail = await UserModel.findOne({email: email});
      console.log(userEmail);
    } catch (err){
      console.log(err);
    }

    const payload = {
      sub: '123456789',
      role: 'admin',
    };

    // https://www.pingidentity.com/en/company/blog/posts/2019/jwt-security-nobody-talks-about.html
    // save hash in db
    // here have to use some other secret imstead of password hash
    //  Next, the consumer has to check the reserved "exp" and "nbf" claims to ensure that the JWT is valid.
    // Asynchronous Sign with default (HMAC SHA256)

    const token = await jwt.sign(payload, auth.secret, { expiresIn: '1h' });
    const decoded = await jwt.verify(token, auth.secret);

    res.json({token: token});
  } catch (err) {
    next(err);
  }

  // secure https-only session cookie to store the JWT.
  // Some methods suggest saving the token in res.locals instead of sending back to the client.
});

module.exports = router;
