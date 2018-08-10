const request = require('request-promise'),
  config = require('../../config'),
  models = require('../models'),
  User = models.user,
  Purchase = models.purchase,
  ALBUMS_URL = config.albums.url,
  ALBUMS_ENDPOINT = 'albums';

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${ALBUMS_URL}${ALBUMS_ENDPOINT}`,
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
        payload.error = `Album ${albumId} has already being bought by User ${userId}`;
        return payload;
      }
      return Purchase.create({ userId, albumId }).then(purchase => {
        payload.value = purchase;
        return payload;
      });
    })
    .then(payload => {
      if (!payload.value) {
        return payload;
      }
      return User.findById(userId)
        .then(user => user.addPurchases([payload.value]))
        .then(() => payload);
    })
    .then(payload => {
      if (!payload.value) {
        return payload;
      }
      return payload.value.reload().then(purchase => {
        payload.value = purchase;
        return payload;
      });
    });
};
