const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('Clients Endpoints', function() {
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
    context('GET All Clients Successful', () => {
      beforeEach('Fill clients', () => {
        return seedHelper.seedClients(db);
      })

      it('User Successful', () => {
        return supertest(app)
          .get('/api/clients')
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:client_id', () => {
    context('GET Client Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedClients(db);
      })

      it('Client Successful', () => {
        return supertest(app)
          .get('/api/clients/1')
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /', () => {
    it('Respons 400 when do not pass validation', () => {
      const newClient = helper.makeClientsArray()[0];
      newClient.full_name = 'F';
      return supertest(app)
        .post('/api/clients')
        .send(newClient)
        .expect(400)
        .expect(res => {
          console.log(res.body);
        })
    })

    context('POST Client Successful', () => {
      /*beforeEach('Fill roles', () => {
        return seedHelper.seedRoles(db);
      })*/

      it('Respons 200 when created', () => {
        const newClient = helper.makeClientsArray()[0];
        return supertest(app)
          .post('/api/clients')
          .send(newClient)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:client_id', () => {
    context('PATCH Client Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedClients(db);
      })

      it('Respons 400 when validated', () => {
        const newClient = {
          full_name: 'F',
          address: '',
          phone: ''
        }
        return supertest(app)
          .patch('/api/clients/1')
          .send(newClient)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newClient = {
          full_name: 'Fabian Lema',
          address: '',
          phone: '6666'
        }
        return supertest(app)
          .patch('/api/clients/1')
          .send(newClient)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/clients/1')
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:client_id', () => {
    context('DELETE Client Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedClients(db);
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/clients/1')
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/clients/1')
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

})
