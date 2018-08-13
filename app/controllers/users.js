const User = require(`../models`).user,
  errors = require('../errors'),
  encode = require('hashcode').hashCode,
  jwt = require('../tools/jwtToken');
require('dotenv').config();

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

exports.authenticate = (req, res, next) =>
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      const hashedPassword = encode().value(req.body.password);
      if (user.password === `${hashedPassword}`) {
        const token = jwt.createToken({ user_id: user.id });
        const userWithToken = {
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

exports.list = (req, res, next) =>
  User.findAndCountAll()
    .then(data => {
      const page = req.query.page && req.query.page >= 1 ? req.query.page : 1, // page number
        limit = req.query.limit && req.query.limit >= 0 ? req.query.limit : 3, // number of records per page
        pages = Math.ceil(data.count / limit),
        offset = limit * (page - 1);
      return User.findAll({
        limit,
        offset,
        order: [['id', 'ASC']]
      }).then(users => {
        res.status(201).json({ result: users, count: data.count, pages });
      });
    })
    .catch(error => {
      next(errors.defaultError(`Database error - ${error}`));
    });
