'use strict';

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  dictum = require('dictum.js'),
  NEW_USER_ENDPOINT = '/users';

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
  });
});
