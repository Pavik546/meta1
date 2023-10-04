const { randomBytes } = require('crypto');


// Generate a random 32-byte (256-bit) secret key
const secretKey = randomBytes(32).toString('hex');

module.exports = {
  secretKey,
};
