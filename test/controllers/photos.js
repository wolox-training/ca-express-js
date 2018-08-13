'use strict';

const fs = require('fs'),
  encode = require('hashcode').hashCode,
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  dictum = require('dictum.js'),
  jwt = require('../../app/tools/jwtToken'),
  moment = require('moment'),
  mocks = require('../support/mocks'),
  User = require('../../app/models').user,
  Purchase = require('../../app/models').purchase;

const LIST_PURCHASED_ALBUMS_ENDPOINT = albumId => `/users/albums/${albumId}/photos`,
  LIST_PURCHASED_ALBUMS_ENDPOINT_LABEL = '/users/albums/2/photos';

chai.should();

describe.only('photos controller', () => {
  describe(`${LIST_PURCHASED_ALBUMS_ENDPOINT_LABEL} GET`, () => {
    const futureTime = moment().add(moment.duration(60, 'seconds'));
    const pastTime = moment().subtract(moment.duration(1, 'seconds'));
    const purchasedAlbumId = 1,
      notPurchasedAlbumId = 2;
    let validToken, invalidToken, user;
    beforeEach('populate database and create mocks', done => {
      mocks.mockAlbums();
      mocks.mockPhotosForAlbumId(purchasedAlbumId);
      mocks.mockPhotosForAlbumId(notPurchasedAlbumId);

      User.create({
        firstName: 'UserName',
        lastName: 'UserLastName',
        email: 'validUser@wolox.com.ar',
        password: encode().value('passord1')
      })
        .then(createdUser => {
          user = createdUser;
          validToken = jwt.createToken({ user_id: user.id }, futureTime);
          invalidToken = jwt.createToken({ user_id: user.id }, pastTime);
          return createdUser;
        })
        .then(createdUser => {
          return Purchase.create({ albumId: purchasedAlbumId }).then(purchase =>
            createdUser.addPurchases([purchase])
          );
        })
        .then(() => done())
        .catch(error => {
          console.log(`-------- ERROR 1 - ${error}`);
        });
    });
    context('When requesting with a valid token', () => {
      context('Ask for photos from a purchased album', () => {
        it('should return the full list of photos', done => {
          chai
            .request(server)
            .get(LIST_PURCHASED_ALBUMS_ENDPOINT(purchasedAlbumId))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.length.should.be.eq(2);
              res.body[0].should.be.eq('http://placehold.it/600/8e973b');
              res.body[1].should.be.eq('http://placehold.it/600/121fa4');
              dictum.chai(res, 'Endpoint to list albums');
              done();
            })
            .catch(error => {
              console.log(`-------- ERROR 2 - ${error}`);
            });
        });
      });
      context('Ask for photos from a not purchased album', () => {
        it('should return 500', done => {
          chai
            .request(server)
            .get(LIST_PURCHASED_ALBUMS_ENDPOINT(notPurchasedAlbumId))
            .set('session_token', validToken)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
    });
    context('When requesting with an invalid token', () => {
      context('no token', () => {
        it('should return 500', done => {
          chai
            .request(server)
            .get(LIST_PURCHASED_ALBUMS_ENDPOINT(purchasedAlbumId))
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
      context('expired token', () => {
        it('should return 500', done => {
          chai
            .request(server)
            .get(LIST_PURCHASED_ALBUMS_ENDPOINT(purchasedAlbumId))
            .set('session_token', invalidToken)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
    });
  });
});
