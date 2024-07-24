const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  JWTStrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;

const { User } = require('./models');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  User.findOne({ username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }
    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, { message: 'Incorrect password.' });
    }
    console.log('finished');
    return callback(null, user);
  });
}));

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
};

passport.use(new JWTStrategy(opts, (jwtPayload, callback) => {
  return User.findById(jwtPayload._id)
    .then(user => {
      return callback(null, user);
    })
    .catch(error => {
      return callback(error)
    });
}));
