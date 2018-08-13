const errors = require('../errors'),
  albumsService = require('../services/albums');
require('dotenv').config();

exports.list = (req, res, next) =>
  albumsService
    .getPhotosforPurchasedAlbum(req.body.token_data.user_id, req.params.id)
    .then(data => res.status(201).json(data))
    .catch(error => next(errors.defaultError(`Database error - ${error}`)));
