const errors = require('../errors');

function hasAllParameters(body) {
  return typeof body.email !== 'undefined' && typeof body.password !== 'undefined';
}

exports.handle = (req, res, next) => {
  // Validate fields
  if (!hasAllParameters(req.body)) {
    next(errors.defaultError('Missing parameters!'));
    return;
  }

  next();
};
