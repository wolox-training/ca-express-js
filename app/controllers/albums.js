const User = require(`../models`).user,
  errors = require('../errors'),
  encode = require('hashcode').hashCode,
  jwt = require('../tools/jwtToken'),
  albumsService = require('../services/albums');
require('dotenv').config();

exports.list = (req, res, next) => {
  return jwt
    .verifyToken(req.headers.session_token)
    .then(jwt.veryfyExpiration)
    .then(payload => {
      if (!payload.value) {
        if (payload.error) {
          next(errors.defaultError(payload.error));
          return;
        } else {
          next('Unknown error');
          return;
        }
      }
      return albumsService
        .getAlbums()
        .then(data => res.status(201).json(data))
        .catch(error => next(errors.defaultError(`Database error - ${error}`)));
    })
    .catch(maybeError => next(errors.defaultError(`Decoding error - ${maybeError || 'Unknown'}`)));
};
