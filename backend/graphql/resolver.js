// The root provides a resolver function for each API endpoint
const jwt = require('jsonwebtoken');
const {
  generatePassword,
  verifyPassword,
} = require('../authLocalService/authLocal');
const knex = require('../knex');
const { verifyToken, signToken } = require('../tokenService/tokenService');

const resolver = {
  login: async (root, context) => {
    const { username, password } = root;
    try {
      const currentUser = await knex('user')
        .where({
          username,
        })
        .select(['username', 'password']);
      if (currentUser.length === 1) {
        const userPassword = currentUser[0].password;
        if (await verifyPassword(userPassword, password)) {
          const token = await signToken('Test data');
          return {
            success: true,
            token,
          };
        }
      }
      return {
        success: false,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  },

  register: async (root, context) => {
    const { username, password } = root.userInput;
    const currentUser = await knex('user')
      .where('username', username)
      .select(['username']);
    console.log(currentUser);
    if (currentUser.length > 0) {
      return { success: false, username: 'Already' };
    }
    try {
      const hashedPassword = await generatePassword(password);
      const newUser = await knex('user').insert({
        username,
        password: hashedPassword,
      });
      if (newUser.length > 0) {
        return { success: true, username };
      }
    } catch (error) {
      return { success: false, username: `Can't create new user` };
    }
  },

  test: async (root, context) => {
    try {
      await verifyToken(context.req);

      console.log('Auth!');
      return 'Auth!';
    } catch (err) {
      console.log('error');
      return 'Error';
    }
  },
};

module.exports = resolver;
