const errors = require('../errors');

const hasAllParameters = body => {
  return (
    typeof body.email !== 'undefined' &&
    typeof body.password !== 'undefined' &&
    typeof body.first_name !== 'undefined' &&
    typeof body.last_name !== 'undefined'
  );
};

const isValidMail = mail => {
  const re = /[A-Z0-9._%+-]*@wolox.com.ar/;
  return re.test(mail);
};

const isValidPassword = password => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

exports.handle = (req, res, next) => {
  // Validate fields
  if (!hasAllParameters(req.body)) {
    next(errors.defaultError('Missing parameters!'));
    return;
  }

  // Validate email domain
  if (!isValidMail(req.body.email)) {
    next(errors.defaultError('Invalid email!'));
    return;
  }

  // Validate password
  if (!isValidPassword(req.body.password)) {
    next(errors.defaultError('Invalid password!'));
    return;
  }

  next();
};
