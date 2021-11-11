const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FaceBookStrategy } = require('passport-facebook');
const { signToken } = require('../tokenService/tokenService');

// Passport Strategy
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
        done(null, profile);
      }
    } catch (error) {
      done(error, false);
    }
  }
);

// Authenticate via Passport
const authGoogleCallback = async (req, res) => {
  const { id, displayName } = req.user;
  console.log('auth google ', req.user.accessToken);
  const signedToken = await signToken('test-data');
  return res.redirect(`http://localhost:3000/verify?token=${signedToken}`);
};

const authFacebookCallback = async (req, res) => {
  const { id, displayName } = req.user;
  console.log('auth facebook ------- ', req.user);
  const signedToken = await signToken('test-data');
  return res.redirect(`http://localhost:3000/verify?token=${signedToken}`);
};

// Passport use these strategies
passport.use(googleStrategy);
passport.use(facebookStrategy);

module.exports = { authGoogleCallback, authFacebookCallback };
