const express = require('express');
const promotionsRoute = express.Router();
const jsonParser = express.json();
const PromotionsService = require('./promotions-service');
const PromotionDetailService = require('./prom-prod-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');

promotionsRoute
  .route('/')
  .get((req, res, next) => {
    PromotionsService.getAllPromotions(req.app.get('db'))
      .then(promotions => {
        res.json(promotions.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, description, stock, price, picture } = req.body
    const newPromotion = {
      name,
      description,
      stock,
      price,
      picture
    }
    const errorValidator = validator.validate(newPromotion, 'promotion')
    if (errorValidator){
      return res.status(400).json({error : errorValidator});
    }
    return PromotionsService.insertPromotion(req.app.get('db'), newPromotion)
      .then(promotion => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${promotion.id}`))
          .json(Utils.serialize(promotion))
      })
  })

  promotionsRoute
    .route('/:promotion_id')
    .all((req, res, next) => {
    const { promotion_id } = req.params
    PromotionsService.getById(req.app.get('db'), promotion_id)
      .then(promotion => {
        if (!promotion) {
          //logger.error(`Promotion with id ${promotion_id} not found.`)
          return res.status(404).json({
            error: { message: `Promotion Not Found` }
          })
        }
        res.promotion = promotion
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(Utils.serialize(res.promotion))
  })
  .delete((req, res, next) => {
    const { promotion_id } = req.params
    PromotionsService.inactivePromotion(
      req.app.get('db'),
      promotion_id
    )
    .then(numRowsAffected => {
      //logger.info(`Card with id ${bookmark_id} deleted.`)
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, description, stock, price, picture } = req.body;
    let promotionToUpdate = {
      name,
      description,
      stock,
      price,
      picture
    };
    //const requiredFields = { name, stock, price, picture };
    //promotionToUpdate = Utils.removeEmpty(requiredFields, promotionToUpdate);
    const errorValidator = validator.validate(promotionToUpdate, 'promotion', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }
    PromotionsService.updatePromotion(
      req.app.get('db'),
      req.params.promotion_id,
      promotionToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  promotionsRoute
    .route('/:promotion_id/products/')
    .get((req, res, next) => {
      const { promotion_id } = req.params;
      PromotionDetailService.getAllPromotionDetail(req.app.get('db'), promotion_id)
        .then(promProducts => {
          res.json(promProducts.map(Utils.serialize))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { quantity, product_id } = req.body;
      const { promotion_id } = req.params;
      const newProduct = {
        promotion_id,
        product_id,
        quantity
      }
      const errorValidator = validator.validate(newProduct, 'promProd')
      if (errorValidator){
        return res.status(400).json({error : errorValidator});
      }
      return PromotionDetailService.insertProduct(req.app.get('db'), newProduct)
        .then(product => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${product.id}`))
            .json(Utils.serialize(product))
        })
    })

    promotionsRoute
      .route('/:promotion_id/products/:product_id')
      .all((req, res, next) => {
      const { promotion_id, product_id } = req.params
      PromotionDetailService.getById(req.app.get('db'), promotion_id, product_id)
        .then(product => {
          if (!product) {
            //logger.error(`Promotion with id ${promotion_id} not found.`)
            return res.status(404).json({
              error: { message: `Promotion Not Found` }
            })
          }
          res.product = product
          next()
        })
        .catch(next)

    })
    .get((req, res) => {
      res.json(Utils.serialize(res.product))
    })
    .delete((req, res, next) => {
      const { promotion_id, product_id } = req.params
      PromotionDetailService.deleteProduct(
        req.app.get('db'),
        promotion_id,
        product_id
      )
      .then(numRowsAffected => {
        //logger.info(`Card with id ${bookmark_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { quantity } = req.body;
      const productToUpdate = {
        quantity
      };
      //const requiredFields = { quantity };
      const errorValidator = validator.validate(productToUpdate, 'promProd', false)
      if (errorValidator){
        return res.status(400).json(errorValidator);
      }
      PromotionDetailService.updateProduct(
        req.app.get('db'),
        req.params.promotion_id,
        req.params.product_id,
        productToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })

  module.exports = promotionsRoute;
