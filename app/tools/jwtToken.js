const jwt = require('jsonwebtoken'),
  JWT_KEY = require('../constants').jwt_key;

exports.createToken = (payload, exp = Date.now() + Math.floor(process.env.SESSION_EXP) * 1000) => {
  return jwt.sign({ data: payload, exp: exp }, JWT_KEY)
};

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (jwtError, decoded) => {
      if (decoded) {
        resolve(decoded);
      } else {
        reject(jwtError);
      }
    });
  });
};

exports.veryfyExpiration = (payload, comparisonTimestamp = Date.now()) => {
  return new Promise((resolve, reject) => {
    if (payload.exp < Date.now()) {
      reject(`Expired token - exp: ${payload.exp}`);
    } else {
      resolve(payload.data);
    }
  });
}