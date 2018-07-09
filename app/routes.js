require('./tools/simpleHash');
const errors = require('./middlewares/errors');
const users = require('./middlewares/usersValidator');

exports.init = app => {
  app.use('/users', users.handle);
  app.use(errors.handle);

  app.post('/users', function(req, res) {
    res.send('POST Successful!');
  });
};
