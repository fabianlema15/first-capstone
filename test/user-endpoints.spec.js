const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('Users Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helper.cleanTables(db))

  afterEach('cleanup', () => helper.cleanTables(db))

  describe('GET /', () => {
    context('GET All User Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('User Successful', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:user_id', () => {
    context('GET User Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('User Successful', () => {
        return supertest(app)
          .get('/api/users/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

      it('User Successful with Correct User Code', () => {
        return supertest(app)
          .get('/api/users/is/112233')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('User Successful with Incorrec User Code', () => {
        return supertest(app)
          .get('/api/users/is/112243')
          .set('Authorization', helper.makeAuthHeader())
          .expect(404)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('POST /', () => {

    context('POST User Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('Respons 400 when do not pass validation', () => {
        const newUser = helper.makeUsersArray()[0];
        newUser.last_name = '';
        return supertest(app)
          .post('/api/users')
          .set('Authorization', helper.makeAuthHeader())
          .send(newUser)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when created', () => {
        const newUser = helper.makeUsersArray()[0];
        return supertest(app)
          .post('/api/users')
          .set('Authorization', helper.makeAuthHeader())
          .send(newUser)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

      it('Respons 200 when created and changed code', () => {
        const newUser = helper.makeUsersArray()[0];
        return supertest(app)
          .post('/api/users')
          .set('Authorization', helper.makeAuthHeader())
          .send(newUser)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

    })
  })

  describe('PATCH /:user_id', () => {
    context('PATCH User Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('Respons 400 when validated', () => {
        const newUser = {
          first_name: 'Fas',
          last_name: 'Lew',
          address: '',
          role: 0
        }
        return supertest(app)
          .patch('/api/users/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newUser)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newUser = {
          first_name: 'Fabiansdsd',
          last_name: 'Lem',
          address: '',
        }
        return supertest(app)
          .patch('/api/users/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newUser)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/users/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:user_id', () => {
    context('DELETE User Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/users/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/users/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(401)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /get/:type', () => {
    context('GET User Type Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('Get roles from users', () => {
        return supertest(app)
          .get('/api/users/get/roles')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('GET /getbyrol/:role', () => {
    context('GET User By Rol Successful', () => {
      beforeEach('Fill users', () => {
        return seedHelper.seedUsers(db);
      })

      it('Get users by role', () => {
        return supertest(app)
          .get('/api/users/getbyrol/MANAGER')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

})
