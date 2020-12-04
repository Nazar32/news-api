const crypto = require('crypto');

const getStringHash = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

module.exports = getStringHash;
