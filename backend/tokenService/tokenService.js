const { SignJWT } = require('jose/jwt/sign');
const { jwtVerify } = require('jose/jwt/verify');
const { privateKey, publicKey } = require('./tokenUltil');

const signToken = async (data) => {
  const jwt = await new SignJWT({
    data,
  })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setIssuer('issuer')
    .setAudience('audience')
    .setExpirationTime('1d')
    .sign(privateKey);
  return jwt;
};

const getTokenFromHeaderRequest = (req) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      return token;
    }
  }
  return undefined;
};

const verifyToken = async (req) => {
  try {
    const token = getTokenFromHeaderRequest(req);
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: 'issuer',
      audience: 'audience',
      algorithms: ['EdDSA'],
    });
    return payload;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  signToken,
  verifyToken,
};
