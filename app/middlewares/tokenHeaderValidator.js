const errors = require('../errors');

exports.handle = (req, res, next) => {
  // Validate fields
  if (typeof req.headers.session_token === 'undefined') {
    next(errors.defaultError('Missing token!'));
    return;
  }

  next();
};
