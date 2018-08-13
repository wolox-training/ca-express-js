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

exports.mockPhotosForAlbumId = albumId => {
  const response = [
    {
      albumId,
      id: 1,
      title: 'non sunt voluptatem placeat consequuntur rem incidunt',
      url: 'http://placehold.it/600/8e973b',
      thumbnailUrl: 'http://placehold.it/150/8e973b'
    },
    {
      albumId,
      id: 2,
      title: 'eveniet pariatur quia nobis reiciendis laboriosam ea',
      url: 'http://placehold.it/600/121fa4',
      thumbnailUrl: 'http://placehold.it/150/121fa4'
    }
  ];

  return nock(config.albums.url)
    .get(`/albums/${albumId}/photos`)
    .reply(202, response);
};
