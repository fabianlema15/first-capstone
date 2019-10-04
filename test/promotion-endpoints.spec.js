const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('Promotions Endpoints', function() {
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

  beforeEach('fill', () => seedHelper.seedUsers(db))

  afterEach('cleanup', () => helper.cleanTables(db))

  describe('GET /', () => {
    context('GET All Promotions Successful', () => {
      beforeEach('Fill promotions', () => {
        return seedHelper.seedPromotions(db);
      })

      it('Promotion Successful', () => {
        return supertest(app)
          .get('/api/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:promotion_id', () => {
    context('GET Promotion Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db);
      })

      it('Promotion Successful', () => {
        return supertest(app)
          .get('/api/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
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
        .set('Authorization', helper.makeAuthHeader())
        .send(newProduct)
        .expect(400)
        .expect(res => {
          console.log(res.body);
        })
    })

    context('POST Promotion Successful', () => {
      /*beforeEach('Fill roles', () => {
        return seedHelper.seedRoles(db);
      })*/

      it('Respons 201 when created', () => {
        const newPromotion = helper.makePromotionsArray()[0];
        return supertest(app)
          .post('/api/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:promotion_id', () => {
    context('PATCH Promotion Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db);
      })

      it('Respons 400 when validated', () => {
        const newPromotion = {
          name: 'D',
          description: '',
          stock: 73,
          price: 51.23,
          picture: ''
        }
        return supertest(app)
          .patch('/api/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newPromotion = {
          description: 'Promotion to test 3',
          stock: 73,
          price: 51.23,
          picture: 'Url to picture 3'
        }
        return supertest(app)
          .patch('/api/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/promotions/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:promotion_id', () => {
    context('DELETE Promotion Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db);
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/promotions/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /:promotion_id/products', () => {
    context('GET All Promotions Product Successful', () => {
      beforeEach('Fill promotions', () => {
        return seedHelper.seedPromotions(db)
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedPromotionProduct(db));
      })

      it('Promotion Product Successful', () => {
        return supertest(app)
          .get('/api/promotions/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('GET /:promotion_id/products/:producto_id', () => {
    context('GET Promotion Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db)
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedPromotionProduct(db));
      })

      it('Promotion Successful', () => {
        return supertest(app)
          .get('/api/promotions/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /:promotion_id/products', () => {
    context('POST Promotion Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db)
            .then(() => seedHelper.seedProducts(db));
      })

      it('Respons 400 when do not pass validation', () => {
        const newProduct = helper.makePromotionProductArray()[0];
        //newProduct.quantity = null;
        newProduct.product_id = -23;
        return supertest(app)
          .post('/api/promotions/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when created', () => {
        const newProduct = helper.makePromotionProductArray()[0];
        return supertest(app)
          .post('/api/promotions/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:promotion_id/products/:producto_id', () => {
    context('PATCH Promotion Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db)
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedPromotionProduct(db));
      })

      it('Respons 400 when validated product', () => {
        const newPromotion = {
          quantity: null,
        }
        return supertest(app)
          .patch('/api/promotions/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newPromotion = {
          quantity: 100,
        }
        return supertest(app)
          .patch('/api/promotions/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/promotions/1/products/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:promotion_id/products/:producto_id', () => {
    context('DELETE Promotion Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedPromotions(db)
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedPromotionProduct(db));
      })

      it('Respons 200 when deleted', () => {
        return supertest(app)
          .delete('/api/promotions/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/promotions/1/products/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

})
