const request = require('request-promise'),
  config = require('../../config'),
  models = require('../models'),
  User = models.user,
  Purchase = models.purchase,
  ALBUMS_URL = config.albums.url,
  ALBUMS_ENDPOINT = 'albums',
  PHOTOS_ENDPOINT = albumId => `albums/${albumId}/photos`;

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${ALBUMS_URL}${ALBUMS_ENDPOINT}`,
    json: true
  });

exports.getPhotos = albumId =>
  request({
    method: 'GET',
    uri: `${ALBUMS_URL}${PHOTOS_ENDPOINT(albumId)}`,
    json: true
  });

exports.findOrBuy = (userId, albumId) => {
  const alreadyBought = {
    where: {
      user_id: userId,
      album_id: albumId
    }
  };

  return Purchase.findAll(alreadyBought)
    .then(purchases => {
      const payload = { value: null, error: null };
      if (purchases.length > 0) {
        throw new Error(`Album ${albumId} has already being bought by User ${userId}`);
      }
      return Purchase.create({ userId, albumId });
    })
    .then(purchase => {
      return User.findById(userId)
        .then(user => user.addPurchases([purchase]))
        .then(() => purchase);
    })
    .then(purchase => purchase.reload());
};

exports.getPhotosforPurchasedAlbum = (userId, albumId) => {
  const alreadyBought = {
    where: {
      user_id: userId,
      album_id: albumId
    }
  };

  return Purchase.findOne(alreadyBought)
    .then(purchase => {
      if (!purchase) throw new Error('Album not purchased');
      return purchase.albumId;
    })
    .then(exports.getPhotos)
    .then(photos => photos.map(photo => photo.url));
};
