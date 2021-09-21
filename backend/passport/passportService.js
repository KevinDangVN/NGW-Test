const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');

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

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback',
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    try {
      if (profile) {
        console.log(profile);
        done(null, profile);
      }
    } catch (err) {
      done(err, false);
    }
  }
);

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

const authGoogle = async (req, res) => {
  const { id, displayName } = req.user;
  console.log('auth google ', req.user.accessToken);
  const signedJWT = jwt.sign(
    {
      username: 'user01-payload',
    },
    'wowwow',
    {
      expiresIn: '1h',
    }
  );
  res.redirect(`http://localhost:3000/verify?token=${signedJWT}`);
};

// Passport use these strategies
passport.use(localStrategy);
passport.use(googleStrategy);

module.exports = { authLocal, authGoogle };