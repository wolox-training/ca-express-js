const errors = require('../errors'),
  jwt = require('../tools/jwtToken');

exports.handle = (req, res, next) => {
  return jwt
    .verifyToken(req.headers.session_token)
    .then(jwt.veryfyExpiration)
    .then(payload => {
      if (!payload.value) {
        next(errors.defaultError(`Expiration Error - ${payload.error || 'Unknown'}`));
      }
      req.body.token_data = payload.value;
    })
    .then(next);
};
