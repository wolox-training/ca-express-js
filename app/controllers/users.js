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

exports.authenticate = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      const hashedPassword = req.body.password.hashCode();
      if (user.password === `${hashedPassword}`) {
        res.status(201).send(user);
      } else {
        console.log(`Error passwords: DB: ${user.password} VS Req: ${hashedPassword}`);
        next(errors.defaultError(`Invalid user`));
      }
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};
