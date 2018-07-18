const errors = require('../errors');

const isValidMail = mail => {
  const re = /[A-Z0-9._%+-]*@wolox.com.ar/;
  return re.test(mail);
};

exports.handle = (req, res, next) => {
  // Validate email domain
  if (!isValidMail(req.body.email)) {
    next(errors.defaultError('Invalid email!'));
    return;
  }

  next();
};
