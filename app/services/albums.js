const request = require('request-promise'),
  config = require('../../config'),
  ALBUMS_URL = config.albums.url,
  ALBUMS_ENDPOINT = 'albums';

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${ALBUMS_URL}${ALBUMS_ENDPOINT}`,
    json: true
  });
