require('./tools/simpleHash');

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

function isValidPassword(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
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

    // Validate password
    if (!isValidPassword(req.body.password)) {
      res.status(400).send('Invalid password!');
    }

    res.send('POST Successful!');
  });
};
