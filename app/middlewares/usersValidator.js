const errors = require('../errors');

const missingParams = (data, ...params) => {
  return params.filter(p => !data[p]);
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
  const params = missingParams(req.body, 'email', 'password', 'first_name', 'last_name');
  if (!Array.isArray(params) || params.length) {
    next(errors.defaultError(`Missing parameters: ${params}`));
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
