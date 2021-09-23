// Construct a schema, using GraphQL schema language
const { buildSchema } = require('graphql');
const schema = buildSchema(`
  type AuthData {
    success: Boolean,
    username: String
  }

  input UserInputData {
    username: String
    password: String
  }

  type RootQuery {
    login(username: String, password: String): AuthData
    test: String
  }

  type RootMutation {
    register(userInput: UserInputData): AuthData
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  } 
`);

module.exports = schema;
