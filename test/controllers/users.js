'use strict';

const fs = require('fs'),
  encode = require('hashcode').hashCode,
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  dictum = require('dictum.js'),
  User = require(`../../app/models`).user,
  jwt = require('../../app/tools/jwtToken'),
  moment = require('moment');

const NEW_USER_ENDPOINT = '/users',
  NEW_SESSION_ENDPOINT = '/users/sessions',
  LIST_USERS = (limit, page) => `/users?limit=${limit}&page=${page}`,
  LIST_USERS_LABEL = '/users?limit=2&page=1';

chai.should();

const mockUser = emailNumber => {
  return User.create({
    firstName: 'UserName',
    lastName: 'UserLastName',
    email: `validUser${emailNumber}@wolox.com.ar`,
    password: encode().value('password1')
  });
};

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
  describe(`${LIST_USERS_LABEL} GET`, () => {
    beforeEach('populating database with users', done => {
      Promise.all([mockUser(1), mockUser(2), mockUser(3), mockUser(4), mockUser(5), mockUser(6)]).then(() =>
        done()
      );
    });
    context('When requesting with a valid token', () => {
      const futureTime = moment().add(moment.duration(60, 'seconds'));
      const validToken = jwt.createToken({}, futureTime);
      context('using both query params', () => {
        it('should return the first two users', done => {
          chai
            .request(server)
            .get(LIST_USERS(2, 1))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(2);
              res.body.pages.should.be.eq(3);
              dictum.chai(res, 'Endpoint to list users');
              done();
            });
        });
      });
      context('using only one query param - page >= 1', () => {
        it('should return the second 3 users, using default limit to 3', done => {
          chai
            .request(server)
            .get(LIST_USERS('', 2))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(3);
              res.body.result[0].id.should.be.eq(4);
              res.body.pages.should.be.eq(2);
              res.body.count.should.be.eq(6);
              done();
            })
            .catch(console.log);
        });
      });
      context('using only one query param - limit >= 0', () => {
        it('should return the first page', done => {
          const limit = 2;
          chai
            .request(server)
            .get(LIST_USERS(limit, ''))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(limit);
              res.body.result[0].id.should.be.eq(1);
              done();
            })
            .catch(console.log);
        });
      });
      context('without using query params', () => {
        it('should return the first page of 3 users, using default values', done => {
          chai
            .request(server)
            .get(LIST_USERS('', ''))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(3);
              res.body.result[0].id.should.be.eq(1);
              res.body.pages.should.be.eq(2);
              done();
            })
            .catch(console.log);
        });
      });
      context('using bad limit', () => {
        it('should return a page of 3 users, using default value', done => {
          chai
            .request(server)
            .get(LIST_USERS(-2, 2))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(3);
              done();
            })
            .catch(console.log);
        });
      });
      context('using bad page', () => {
        it('should return the first page, using default value', done => {
          chai
            .request(server)
            .get(LIST_USERS(2, -2))
            .set('session_token', validToken)
            .then(res => {
              res.should.have.status(201);
              res.body.result.length.should.be.eq(2);
              res.body.result[0].id.should.be.eq(1);
              res.body.pages.should.be.eq(3);
              done();
            })
            .catch(console.log);
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
            .get(LIST_USERS(2, 1))
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
            .get(LIST_USERS(2, 1))
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
