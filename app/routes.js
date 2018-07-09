const errors = require('./middlewares/errors'),
  users = require('./controllers/users'),
  usersParameterValidator = require('./middlewares/usersValidator');
require('./tools/simpleHash');

exports.init = app => {
  app.post('/users', usersParameterValidator.handle, users.create);
};
