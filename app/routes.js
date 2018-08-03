const errors = require('./middlewares/errors'),
  users = require('./controllers/users'),
  usersParameterValidator = require('./middlewares/usersValidator'),
  emailValidator = require('./middlewares/emailValidator'),
  sessionParameterValidator = require('./middlewares/sessionParameterValidator'),
  tokenHeaderValidator = require('./middlewares/tokenHeaderValidator'),
  albums = require('./controllers/albums');

exports.init = app => {
  app.post('/users', [usersParameterValidator.handle, emailValidator.handle], users.create);
  app.post('/users/sessions', [sessionParameterValidator.handle, emailValidator.handle], users.authenticate);
  app.get('/users', tokenHeaderValidator.handle, users.list);
  app.get('/albums', albums.list);
};
