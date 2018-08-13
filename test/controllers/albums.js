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

const ALBUMS_ENDPOINT = '/albums',
  BUY_ALBUMS_ENDPOINT = albumId => `/albums/${albumId}`,
  BUY_ALBUMS_ENDPOINT_LABEL = '/albums/12';

chai.should();

describe('albums controller', () => {
  describe(`${ALBUMS_ENDPOINT} GET`, () => {
    beforeEach(() => {
      mocks.mockAlbums();
    });
    context('When requesting with a valid token', () => {
      const futureTime = moment().add(moment.duration(60, 'seconds'));
      const validToken = jwt.createToken({}, futureTime);
      context('listing albums', () => {
        it('should return 2 albums', done => {
          chai
            .request(server)
            .get(ALBUMS_ENDPOINT)
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.length.should.be.eq(2);
              dictum.chai(res, 'Endpoint to list albums');
              done();
            });
        });
      });
    });
    context('When requesting with an invalid token', () => {
      const pastTime = moment().subtract(moment.duration(1, 'seconds'));
      const invalidToken = jwt.createToken({}, pastTime);
      context('no token', () => {
        it('should return 500', done => {
          chai
            .request(server)
            .get(ALBUMS_ENDPOINT)
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
            .get(ALBUMS_ENDPOINT)
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
  describe(`${BUY_ALBUMS_ENDPOINT_LABEL} POST`, () => {
    beforeEach(() => {
      mocks.mockAlbums();
    });
    context('When requesting with a valid token', () => {
      const futureTime = moment().add(moment.duration(60, 'seconds'));
      let validToken, user;
      beforeEach('create valid user', done => {
        User.create({
          firstName: 'UserName',
          lastName: 'UserLastName',
          email: 'validUser@wolox.com.ar',
          password: encode().value('passord1')
        })
          .then(createdUser => {
            user = createdUser;
            validToken = jwt.createToken({ user_id: user.id }, futureTime);
          })
          .then(() => done());
      });
      context('buy first album', () => {
        it('should return bought album', done => {
          chai
            .request(server)
            .post(BUY_ALBUMS_ENDPOINT(user.id))
            .set('session_token', validToken)
            .send({})
            .then(res => {
              res.should.have.status(201);
              res.body.should.have.property('albumId');
              res.body.should.have.property('user_id');
              res.body.albumId.should.be.eq(1);
              res.body.user_id.should.be.eq(1);
              dictum.chai(res, 'Endpoint to list albums');
              done();
            })
            .catch(error => {
              console.log(`-------- ERROR 1 - ${error}`);
            });
        });
      });
      context('when trying to buy album again', () => {
        beforeEach('purchase an album', done => {
          Purchase.create({
            albumId: 1
          })
            .then(purchase => {
              user.addPurchases([purchase]);
            })
            .then(() => done());
        });
        it('should return bought album', done => {
          chai
            .request(server)
            .post(BUY_ALBUMS_ENDPOINT(user.id))
            .set('session_token', validToken)
            .send({})
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
    });
    context('When requesting with an invalid token', () => {
      const pastTime = moment().subtract(moment.duration(1, 'seconds'));
      const invalidToken = jwt.createToken({ user_id: 10 }, pastTime);
      context('no token', () => {
        it('should return 500', done => {
          chai
            .request(server)
            .post(BUY_ALBUMS_ENDPOINT(10))
            .send({})
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
            .post(BUY_ALBUMS_ENDPOINT(10))
            .set('session_token', invalidToken)
            .send({})
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
