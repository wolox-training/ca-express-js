const User = require(`../models`).user,
  errors = require('../errors');

exports.create = (req, res, next) => {
  const createUser = User.create({
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  });

  createUser
    .then(user => res.status(201).send(user))
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};
