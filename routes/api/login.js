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

  try {
    const user = await UserModel.findOne({email: email});
    let hash = user ? user.hash : 'some hash for prevent timing attacks';
    const isValid = await bcrypt.compare(password, hash);

    if (!isValid){
      return next(createError(401));
    }

    const payload = {
      sub: user._id,
      role: 'admin',
    };

    const token = await jwt.sign(payload, auth.secret, { expiresIn: '1h' });
    // const decoded = await jwt.verify(token, auth.secret);
    res.json({token: token});

    // https://www.pingidentity.com/en/company/blog/posts/2019/jwt-security-nobody-talks-about.html
    // here have to use some other secret imstead of password hash
    //  Next, the consumer has to check the reserved "exp" and "nbf" claims to ensure that the JWT is valid.
    // Asynchronous Sign with default (HMAC SHA256)
    // secure https-only session cookie to store the JWT.
    // Some methods suggest saving the token in res.locals instead of sending back to the client.
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
