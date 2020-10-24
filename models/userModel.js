const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  confirmed: Boolean,
  active: Boolean,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('UserModel', userSchema);
