'use strict';

const fs = require('fs'),
  encode = require('hashcode').hashCode,
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  dictum = require('dictum.js'),
  NEW_USER_ENDPOINT = '/users',
  NEW_SESSION_ENDPOINT = '/users/sessions',
  User = require(`../../app/models`).user;

chai.should();

describe('users controller', () => {
  describe(`${NEW_USER_ENDPOINT} POST`, () => {
    const params = {
      email: 'crisasd2@wolox.com.ar',
      password: 'yassord1',
      first_name: 'Cristian',
      last_name: 'Ames'
    };

    context('When creating a valid user', () => {
      it('returns status 201', done => {
        chai
          .request(server)
          .post(NEW_USER_ENDPOINT)
          .send(params)
          .then(res => {
            res.should.have.status(201);
            res.should.be.json;
            dictum.chai(res, 'Endpoint to create a new user');
            done();
          });
      });
    });

    context('When trying to create a user using invalid data', () => {
      context('Repeated email', () => {
        beforeEach('insert previous entry', done => {
          chai
            .request(server)
            .post(NEW_USER_ENDPOINT)
            .send(params)
            .then(res => {
              res.should.have.status(201);
              done();
            });
        });

        it('returns status 500', done => {
          chai
            .request(server)
            .post(NEW_USER_ENDPOINT)
            .send(params)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
      context('Invalid password', () => {
        const invalidParams = {
          email: 'crisasd2@wolox.com.ar',
          password: 'invalid',
          first_name: 'Cristian',
          last_name: 'Ames'
        };

        it('returns status 500', done => {
          chai
            .request(server)
            .post(NEW_USER_ENDPOINT)
            .send(invalidParams)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
      context('Missing parameters', () => {
        const invalidParams = {
          email: 'crisasd2@wolox.com.ar',
          password: 'yassord1',
          first_name: 'Cristian'
        };

        it('returns status 500', done => {
          chai
            .request(server)
            .post(NEW_USER_ENDPOINT)
            .send(invalidParams)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
    });
  });
  describe(`${NEW_SESSION_ENDPOINT} POST`, () => {
    beforeEach('create valid user', done => {
      User.create({
        firstName: 'UserName',
        lastName: 'UserLastName',
        email: 'validUser@wolox.com.ar',
        password: encode().value('passord1')
      }).then(() => done());
    });
    context('When requesting with a valid user', () => {
      const params = {
        email: 'validUser@wolox.com.ar',
        password: 'passord1'
      };
      it('return status 201', done => {
        chai
          .request(server)
          .post(NEW_SESSION_ENDPOINT)
          .send(params)
          .then(res => {
            res.should.have.status(201);
            res.body.should.have.property('session_token');
            dictum.chai(res, 'Endpoint to create a new user session');
            done();
          });
      });
    });
    context('When requesting with invalid data', () => {
      context('Invalid email', () => {
        const invalidParams = {
          email: 'invalid@wolox.com.ar',
          password: 'passord1'
        };
        it('return status 500', done => {
          chai
            .request(server)
            .post(NEW_SESSION_ENDPOINT)
            .send(invalidParams)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
      context('Invalid password', () => {
        const invalidParams = {
          email: 'validUser@wolox.com.ar',
          password: 'invalid'
        };
        it('return status 500', done => {
          chai
            .request(server)
            .post(NEW_SESSION_ENDPOINT)
            .send(invalidParams)
            .catch(res => {
              res.status.should.be.eq(500);
              res.response.body.should.have.property('message');
              done();
            });
        });
      });
      context('Missing parameters', () => {
        const invalidParams = {
          email: 'validUser@wolox.com.ar'
        };
        it('return status 500', done => {
          chai
            .request(server)
            .post(NEW_SESSION_ENDPOINT)
            .send(invalidParams)
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
