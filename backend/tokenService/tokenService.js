const { generateKeyPair } = require('jose/util/generate_key_pair');
const fs = require('fs');
const { KeyObject } = require('crypto');
const crypto = require('crypto');
const { SignJWT } = require('jose/jwt/sign');
const { jwtVerify } = require('jose/jwt/verify');

const generateTokenKeyPair = async () => {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', {
    crv: 'Ed25519',
  });

  if (publicKey instanceof KeyObject && privateKey instanceof KeyObject) {
    const pubKey = publicKey.export({
      format: 'pem',
      type: 'spki',
    });

    const priKey = privateKey.export({
      format: 'pem',
      type: 'pkcs8',
    });
    fs.writeFileSync(`${__dirname}/ed25519-priv.pem`, priKey);
    fs.writeFileSync(`${__dirname}/ed25519-pub.pem`, pubKey);
  }
};

const readTokenKeyPair = () => {
  const privateKey = crypto.createPrivateKey({
    key: fs.readFileSync(`${__dirname}/ed25519-priv.pem`),
    format: 'pem',
    type: 'pkcs8',
  });

  const publicKey = crypto.createPublicKey({
    key: fs.readFileSync(`${__dirname}/ed25519-pub.pem`),
    format: 'pem',
    type: 'spki',
  });
  return { privateKey, publicKey };
};

const signToken = async (data) => {
  const { _, privateKey } = readTokenKeyPair();
  const jwt = await new SignJWT({
    data,
  })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setIssuer('issuer')
    .setAudience('audience')
    .setExpirationTime('1d')
    .sign(privateKey);
  console.log(jwt);
  return jwt;
};

const verifyToken = async (token) => {
  const { privateKey, publicKey } = readTokenKeyPair();
  const { payload, protectedHeader } = await jwtVerify(token, publicKey, {
    issuer: 'issuer',
    audience: 'audience',
    algorithms: ['EdDSA'],
  });
  console.log(payload);
};

module.exports = {
  generateTokenKeyPair,
  readTokenKeyPair,
  signToken,
  verifyToken,
};
