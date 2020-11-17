const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const {databaseURL, mongooseParams} = require('./config');

const index = require('./routes/ui/index');
const login = require('./routes/ui/login');
const signUp = require('./routes/ui/signup');
const loginApi = require('./routes/api/login');
const signUpApi = require('./routes/api/signup');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json());

app.use('/', index);
app.use('/ui/login', login);
app.use('/ui/signup', signUp);
app.use('/api/login', loginApi);
app.use('/api/signup', signUpApi);

mongoose.connect(databaseURL, mongooseParams);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  console.log(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal error occured' : err.message;

  res.status(status).send(message);
});

module.exports = app;
