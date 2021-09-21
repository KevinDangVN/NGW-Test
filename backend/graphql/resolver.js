// The root provides a resolver function for each API endpoint
const jwt = require('jsonwebtoken');
const passport = require('passport');
const knex = require('../knex');
const { authLocal } = require('../passport/passportService');

const resolver = {
  login: async ({ username, password }, context) => {
    const value = await knex('user')
      .where({
        username,
        password,
      })
      .select(['username', 'password']);
    console.log(value);
    if (username === 'user01' && password === 'abc') {
      return {
        success: 'true',
        username: jwt.sign(
          {
            username: 'user01-payload',
          },
          'wowwow',
          {
            expiresIn: '1h',
          }
        ),
      };
    }
    return {
      success: 'false',
      username: username,
    };
  },

  register: async (root, context) => {
    const value = await knex('user').insert({
      username: root.userInput.username,
      password: root.userInput.password,
    });
    console.log(value);
    return { success: 'String', username: 'String' };
  },

  test: async (root, context) => {
    try {
      await authLocal(context.req);

      console.log('Auth!');
      return 'Auth!';
    } catch (err) {
      console.log('error');
      return 'Error';
    }
  },
};

module.exports = resolver;
