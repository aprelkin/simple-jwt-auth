const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  confirmed: Boolean,
  active: Boolean,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('UserModel', userSchema);
