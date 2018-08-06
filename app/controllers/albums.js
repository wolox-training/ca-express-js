const User = require(`../models`).user,
  errors = require('../errors'),
  albumsService = require('../services/albums');
require('dotenv').config();

exports.list = (req, res, next) => {
  return albumsService
    .getAlbums()
    .then(data => res.status(201).json(data))
    .catch(error => next(errors.defaultError(`Error - ${error}`)));
};
