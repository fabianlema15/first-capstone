const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('Products Endpoints', function() {
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
    context('GET All Products Successful', () => {
      beforeEach('Fill products', () => {
        return seedHelper.seedProducts(db);
      })

      it('Product Successful', () => {
        return supertest(app)
          .get('/api/products')
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:product_id', () => {
    context('GET Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedProducts(db);
      })

      it('Product Successful', () => {
        return supertest(app)
          .get('/api/products/1')
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /', () => {

    it('Respons 400 when do not pass validation', () => {
      const newProduct = helper.makeProductsArray()[0];
      newProduct.name = '';
      return supertest(app)
        .post('/api/products')
        .send(newProduct)
        .expect(400)
        .expect(res => {
          console.log(res.body);
        })
    })

    context('POST Product Successful', () => {
      /*beforeEach('Fill roles', () => {
        return seedHelper.seedRoles(db);
      })*/

      it('Respons 200 when created', () => {
        const newProduct = helper.makeProductsArray()[0];
        return supertest(app)
          .post('/api/products')
          .send(newProduct)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:product_id', () => {
    context('PATCH Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedProducts(db);
      })

      it('Respons 400 when validated', () => {
        const newProduct = {
          name: 'B',
          picture: '/images/sdfsd.png',
          decription: '',
          stock: 214,
          price: 14.23
        }
        return supertest(app)
          .patch('/api/products/1')
          .send(newProduct)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newProduct = {
          name: 'Beer 1',
          picture: '/images/sdfsd.png',
          decription: '',
          stock: 214,
          price: 14.23
        }
        return supertest(app)
          .patch('/api/products/1')
          .send(newProduct)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/products/1')
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:product_id', () => {
    context('DELETE Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedProducts(db);
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/products/1')
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/products/1')
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

})
