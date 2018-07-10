const errors = require('./middlewares/errors'),
  users = require('./controllers/users'),
  usersParameterValidator = require('./middlewares/usersValidator'),
  emailValidator = require('./middlewares/emailValidator'),
  authenticationValidator = require('./middlewares/authenticationValidator');
<<<<<<< HEAD
=======
require('./tools/simpleHash');
>>>>>>> Add and refactor middlewares, as long as the endpoint declaration without the token

exports.init = app => {
  app.post('/users', [usersParameterValidator.handle, emailValidator.handle], users.create);
  app.post('/users/sessions', [authenticationValidator.handle, emailValidator.handle], users.authenticate);
};
