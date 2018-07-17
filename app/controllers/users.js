const User = require(`../models`).user,
  errors = require('../errors'),
  encode = require('hashcode').hashCode,
  jwt = require('jsonwebtoken'),
  JWT_KEY = 'key';

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
  return User.findOne({ where: { email: req.body.email } })
    .then(user => {
      const hashedPassword = encode().value(req.body.password);
      if (user.password === `${hashedPassword}`) {
        const token = jwt.sign({ user_id: user.id }, JWT_KEY),
          userWithToken = {
            email: user.email,
            password: user.password,
            first_name: user.firstName,
            last_name: user.lastName,
            session_token: token,
            created_at: user.created_at,
            updated_at: user.updated_at
          };
        res.status(201).send(userWithToken);
      } else {
        console.log(`Error passwords: DB: ${user.password} VS Req: ${hashedPassword}`);
        next(errors.defaultError(`Invalid user`));
      }
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};
