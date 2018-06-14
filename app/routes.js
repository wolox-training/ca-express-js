// const controller = require('./controllers/controller');

function isValidMail(mail) {
  const re = /[A-Z0-9._%+-]*@wolox.com.ar/;
  return re.test(mail);
}

exports.init = app => {
  app.post('/users', function(req, res) {
    // Validate email domain
    if (!isValidMail(req.body.email)) {
      res.status(400).send('Invalid email!');
    }

    res.send('POST Successful!');
  });
};
