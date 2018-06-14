// const controller = require('./controllers/controller');

function hasAllParameters(body) {
  return (
    typeof body.email !== 'undefined' &&
    typeof body.password !== 'undefined' &&
    typeof body.firstName !== 'undefined' &&
    typeof body.lastName !== 'undefined'
  );
}

function isValidMail(mail) {
  const re = /[A-Z0-9._%+-]*@wolox.com.ar/;
  return re.test(mail);
}

exports.init = app => {
  app.post('/users', function(req, res) {
    // Validate fields
    if (!hasAllParameters(req.body)) {
      res.status(400).send('Missing parameters!');
    }

    // Validate email domain
    if (!isValidMail(req.body.email)) {
      res.status(400).send('Invalid email!');
    }

    res.send('POST Successful!');
  });
};
