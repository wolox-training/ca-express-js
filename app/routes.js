const errors = require('./middlewares/errors'),
  users = require('./controllers/users'),
  usersParameterValidator = require('./middlewares/usersValidator'),
  emailValidator = require('./middlewares/emailValidator'),
  sessionParameterValidator = require('./middlewares/sessionParameterValidator'),
  tokenHeaderValidator = require('./middlewares/tokenHeaderValidator'),
  expirationValidator = require('./middlewares/expirationValidator'),
  albums = require('./controllers/albums'),
  photos = require('./controllers/photos');

exports.init = app => {
  app.post('/users', [usersParameterValidator.handle, emailValidator.handle], users.create);
  app.post('/users/sessions', [sessionParameterValidator.handle, emailValidator.handle], users.authenticate);
  app.get('/users', [tokenHeaderValidator.handle, expirationValidator.handle], users.list);
  app.get('/users/albums/:id/photos', [tokenHeaderValidator.handle, expirationValidator.handle], photos.list);
  app.get('/albums', [tokenHeaderValidator.handle, expirationValidator.handle], albums.list);
  app.post('/albums/:id', [tokenHeaderValidator.handle, expirationValidator.handle], albums.buy);
};
