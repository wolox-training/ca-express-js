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
  mocks = require('../support/mocks');

const ALBUMS_ENDPOINT = '/albums';

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
});
