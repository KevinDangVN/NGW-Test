require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const passport = require('passport');
const resolver = require('./graphql/resolver');
const schema = require('./graphql/schema');
const knex = require('./knex');
const { authGoogle, authFacebook } = require('./passport/passportService');
const { signToken } = require('./tokenService/tokenService');

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

app.listen(4000, async () => {
  // await generateTokenKeyPair();
  knex('user')
    .select()
    .then((user) => console.log(user));
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
