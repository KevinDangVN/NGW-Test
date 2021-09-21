const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const resolver = require('./graphql/resolver');
const schema = require('./graphql/schema');
const knex = require('./knex');

const app = express();

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
