const User = require(`../models`).user,
  errors = require('../errors'),
  encode = require('hashcode').hashCode;

exports.create = (req, res, next) => {
  const createUser = User.create({
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    email: req.body.email,
    password: encode().value(req.body.password)
  });

  return createUser
    .then(user => res.status(201).send(user))
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};
