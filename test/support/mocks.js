const nock = require('nock'),
  config = require('../../config');

exports.mockAlbums = () => {
  const response = [
    {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    },
    {
      userId: 1,
      id: 2,
      title: 'sunt qui excepturi placeat culpa'
    }
  ];

  return nock(config.albums.url)
    .get('/albums')
    .reply(202, response);
};
