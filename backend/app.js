require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const passport = require('passport');
const resolver = require('./graphql/resolver');
const schema = require('./graphql/schema');
const knex = require('./knex');
const { authGoogle, authFacebook } = require('./passport/passportService');
const {
  readTokenKeyPair,
  generateTokenKeyPair,
  signToken,
  verifyToken,
} = require('./tokenService/tokenService');

const app = express();

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:3000/signin',
  }),
  authGoogle
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: 'http://localhost:3000/signin',
  }),
  authFacebook
);

app.use(
  '/graphql',
  graphqlHTTP(async (req, res, graphQLParams) => ({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    context: {
      req,
    },
  }))
);
const testToken =
  'eyJhbGciOiJFZERTQSJ9.eyJkYXRhIjoiZGF0YSAtLS0gdGV4dCIsImlhdCI6MTYzMjM3MDIzMSwiaXNzIjoiaXNzdWVyIiwiYXVkIjoiYXVkaWVuY2UiLCJleHAiOjE2MzI0NTY2MzF9.i5lkllfZv4TRrwCozggaERIFSPHfAcE_scuRXaW_oLUTRjLBity96qzcucYmv9PYe0ilkp9dd6Mu32E3rh3RDA';

app.listen(4000, async () => {
  // await generateTokenKeyPair();
  await signToken('data --- text');
  await verifyToken(testToken);
  knex('user')
    .select()
    .then((user) => console.log(user));
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
