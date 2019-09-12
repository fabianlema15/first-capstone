const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('DailySale Endpoints', function() {
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
    context('GET All Sales Successful', () => {
      beforeEach('Fill sales', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('Sale Successful', () => {
        return supertest(app)
          .get('/api/sales')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:sale_id', () => {
    context('GET DailySale Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('DailySale Successful', () => {
        return supertest(app)
          .get('/api/sales/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /', () => {
    context('POST DailySale Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db);
      })

      it('Respons 400 when do not pass validation', () => {
        const newProduct = helper.makeDailySaleArray()[0];
        newProduct.number_sales = null;
        return supertest(app)
          .post('/api/sales')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when created', () => {
        const newDailySale = helper.makeDailySaleArray()[0];
        return supertest(app)
          .post('/api/sales')
          .set('Authorization', helper.makeAuthHeader())
          .send(newDailySale)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:sale_id', () => {
    context('PATCH DailySale Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('Respons 400 when validated', () => {
        const newDailySale = {
          number_sales: 32,
          subtotal: 43.12,
          tax: 4.34,
          total: 54.23,
          observation: '',
          date_sale: 'f'
        }
        return supertest(app)
          .patch('/api/sales/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newDailySale)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newDailySale = {
          user_id: 1,
          number_sales: 32,
          subtotal: 43.12,
          tax: 4.34,
          total: 54.23,
          observation: '',
          date_sale: '2029-01-22T16:28:32.615Z'
        }
        return supertest(app)
          .patch('/api/sales/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newDailySale)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/sales/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:sale_id', () => {
    context('DELETE DailySale Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/sales/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/sales/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /filterby/:column/:from/:to', () => {
    context('GET All Sales Filtered Successful', () => {
      beforeEach('Fill sales', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('Sales Successful', () => {
        return supertest(app)
          .get('/api/sales/filterby/date_sale/2029-01-22/2029-01-22')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /filterbyuser/:user_id/:column/:from/:to', () => {
    context('GET All Sales Filtered User Successful', () => {
      beforeEach('Fill sales', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedDailySales(db));
      })

      it('Sales Successful', () => {
        return supertest(app)
          .get('/api/sales/filterbyuser/1/date_sale/2029-01-22/2029-01-23')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

})
