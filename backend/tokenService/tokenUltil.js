const { generateKeyPair } = require('jose/util/generate_key_pair');
const fs = require('fs');
const crypto = require('crypto');

const generateTokenKeyPair = async () => {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', {
    crv: 'Ed25519',
  });

  if (
    publicKey instanceof crypto.KeyObject &&
    privateKey instanceof crypto.KeyObject
  ) {
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

module.exports = { generateTokenKeyPair, publicKey, privateKey };
