const argon2 = require('argon2');

const generatePassword = async (password) => {
  // Prevent Denial of Service in the future
  if (password.length > 64) {
    throw new Error('Password is too long');
  }

  try {
    const resultString = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB,
      parallelism: 1,
      timeCost: 3,
      hashLength: 100,
    });
    return resultString;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to hash password');
  }
};

const verifyPassword = async (hashedPassword, inputPassword) => {
  // Prevent Denial of Service in the future
  if (password.length > 64) {
    throw new Error('Password is too long');
  }

  try {
    if (await argon2.verify(hashedPassword, inputPassword)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`Can't verify password`);
  }
};

module.exports = {
  generatePassword,
  verifyPassword,
};
