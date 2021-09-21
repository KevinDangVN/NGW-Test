const passport = require('passport');
const passportJWT = require('passport-jwt');

const getUser = () => {
  return true;
};

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// Passport Strategy

const localStrategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// Authenticate via Passport

const authLocal = (req) =>
  new Promise((resolve, reject) => {
    return passport.authenticate(
      'jwt',
      { session: false },
      (err, payload, info) => {
        if (err) reject(info);
        if (payload) resolve(payload);
        else reject(info);
      }
    )(req);
  });

// Passport use this strategy

passport.use(localStrategy);

module.exports = { authLocal };
