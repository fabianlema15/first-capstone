const knex = require('knex');
const app = require('../src/app');
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const jwt = require('jsonwebtoken');

describe('Auth Endpoints', function() {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.cleanTables(db));

  afterEach('cleanup', () => helper.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => seedHelper.seedUsers(db));

    const requiredFields = ['user_code', 'password'];
    const testUser = helper.makeUsersArray()[0];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_code: testUser.user_code,
        password: testUser.password
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });

    it('responds 400 \'invalid user_code or password\' when bad user_code', () => {
      const userInvalidUser = { user_code: '777777', password: 'existy' };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect user_code or password' });
    });

    it('responds 400 \'invalid user_code or password\' when bad password', () => {
      const testUser = helper.makeUsersArray()[0];
      const userInvalidPass = {
        user_code: testUser.user_code,
        password: '345345'
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: 'Incorrect user_code or password' });
    });

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const testUser = helper.makeUsersArray()[0];
      testUser.id = 1;
      const userValidCreds = {
        user_code: testUser.user_code,
        password: testUser.password
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id }, // payload
        process.env.JWT_SECRET,
        {
          subject: testUser.user_code.toString(),
          algorithm: 'HS256',
          expiresIn: process.env.JWT_EXPIRY,
        }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
        /*.expect(200, {
          authToken: expectedToken
        });*/
    });
  });

  describe('PATCH /api/auth/changepassword', () => {
    beforeEach('insert users', () => seedHelper.seedUsers(db));

    it('responds 200 changed', () => {
      testUser = helper.makeUsersArray()[0];
      const userValid = {
        id: 1,
        password: '345345'
      };
      return supertest(app)
        .patch('/api/auth/changepassword')
        .send(userValid)
        .expect(202)
        .expect(res => {
          console.log(res.body);
        })
    });
  });

});
