const dotenv = require('dotenv').config();

function checkAuth(){
  if (!process.env.SECRET){
    throw new Error('auth secret not found');
  }
  if (!process.env.SALT_ROUNDS){
    throw new Error('auth salt rounds not found');
  }
  if (!process.env.MAX_LOGIN_PASS_LENGTH){
    throw new Error('auth max login & password length not found');
  }
}

module.exports = {
  databaseURL: process.env.DB_URL || 'mongodb://localhost/mydb',
  auth: {
    secret: process.env.SECRET,
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    maxLoginPassLength: parseInt(process.env.MAX_LOGIN_PASS_LENGTH),
  },
  mongooseParams: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};

checkAuth();
/*
on a 2GHz core you can roughly expect:
rounds=8 : ~40 hashes/sec
rounds=9 : ~20 hashes/sec
rounds=10: ~10 hashes/sec
rounds=11: ~5  hashes/sec
rounds=12: 2-3 hashes/sec
rounds=13: ~1 sec/hash
rounds=14: ~1.5 sec/hash
rounds=15: ~3 sec/hash
rounds=25: ~1 hour/hash
rounds=31: 2-3 days/hash
*/
