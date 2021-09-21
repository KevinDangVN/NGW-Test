const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const jwt = require('jsonwebtoken');

const resolver = require('./graphql/resolver');
const schema = require('./graphql/schema');
const knex = require('./knex');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

const app = express();

const getUser = () => {
  return true;
};

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);
app.use(passport.initialize());

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

app.listen(4000, () => {
  knex('user')
    .select()
    .then((user) => console.log(user));
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
