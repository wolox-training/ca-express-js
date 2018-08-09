const User = require('../models').user,
  Boughtalbum = require('../models').boughtalbum,
  errors = require('../errors'),
  albumsService = require('../services/albums');
require('dotenv').config();

exports.list = (req, res, next) => {
  return albumsService
    .getAlbums()
    .then(data => res.status(201).json(data))
    .catch(error => next(errors.defaultError(`Error - ${error}`)));
};

exports.buy = (req, res, next) => {
  return albumsService
    .findOrBuy(req.body.token_data.user_id, req.params.id)
    .then(payload => {
      if (!payload.value) {
        next(errors.defaultError(`Error processing the purchase - ${payload.error}`));
        return payload;
      }
      res.status(201).json(payload.value);
      return payload;
    })
    .catch(error => {
      next(errors.defaultError(`Error processing the purchase - ${error}`));
    });
};
