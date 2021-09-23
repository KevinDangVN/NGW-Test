const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FaceBookStrategy } = require('passport-facebook');
const jwt = require('jsonwebtoken');
const { readTokenKeyPair } = require('../tokenService/tokenService');

const getUser = () => {
  return true;
};

const { privateKey, publicKey } = readTokenKeyPair();

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// Passport Strategy
const localStrategy = new JwtStrategy(
  {
    algorithms: 'ES256',
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    // audience: 'audience',
    // issuer: 'issuer',
  },
  function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  }
);

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

const facebookStrategy = new FaceBookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'email'],
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    try {
      if (profile) {
        console.log('Receive from FB -------- ');
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        done(null, { accessToken, refreshToken, profile });
      }
    } catch (error) {
      done(error, false);
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
        console.log(err);
        console.log(info);
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

const authFacebook = async (req, res) => {
  const { id, displayName } = req.user;
  console.log('auth facebook ------- ', req.user);
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
passport.use(facebookStrategy);

module.exports = { authLocal, authGoogle, authFacebook };
