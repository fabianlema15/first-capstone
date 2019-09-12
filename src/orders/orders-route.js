const express = require('express');
const ordersRoute = express.Router();
const jsonParser = express.json();
const OrdersService = require('./orders-service');
const OrderProductService = require('./order-prod-service');
const OrderPromotionService = require('./order-prom-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');

ordersRoute
  .route('/')
  .get((req, res, next) => {
    OrdersService.getAllOrders(req.app.get('db'))
      .then(orders => {
        res.json(orders.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, client_id, subtotal, tax, total, observation } = req.body
    const newOrder = {
      user_id,
      client_id,
      subtotal,
      tax,
      total,
      observation
    }
    const errorValidator = validator.validate(newOrder, 'order')
    if (errorValidator){
      return res.status(400).json({error : errorValidator});
    }
    return OrdersService.insertOrder(req.app.get('db'), newOrder)
      .then(order => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${order.id}`))
          .json(Utils.serialize(order))
      })
  })

  ordersRoute
    .route('/:order_id')
    .all((req, res, next) => {
    const { order_id } = req.params
    OrdersService.getById(req.app.get('db'), order_id)
      .then(order => {
        if (!order) {
          //logger.error(`Order with id ${order_id} not found.`)
          return res.status(404).json({
            error: { message: `Order Not Found` }
          })
        }
        res.order = order
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(Utils.serialize(res.order))
  })
  .delete((req, res, next) => {
    const { order_id } = req.params
    OrdersService.inactiveOrder(
      req.app.get('db'),
      order_id
    )
    .then(numRowsAffected => {
      //logger.info(`Card with id ${bookmark_id} deleted.`)
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id, client_id, subtotal, tax, total, observation } = req.body;
    let orderToUpdate = {
      user_id,
      client_id,
      subtotal,
      tax,
      total,
      observation
    };
    //const requiredFields = { user_id, client_id, subtotal, tax, total };
    //orderToUpdate = Utils.removeEmpty(requiredFields, orderToUpdate);
    const errorValidator = validator.validate(orderToUpdate, 'order', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }
    OrdersService.updateOrder(
      req.app.get('db'),
      req.params.order_id,
      orderToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  ordersRoute
    .route('/:order_id/products/')
    .get((req, res, next) => {
      const { order_id } = req.params;
      OrderProductService.getAllOrderProduct(req.app.get('db'), order_id)
        .then(orderProds => {
          res.json(orderProds.map(Utils.serialize))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { quantity, product_id, price, observation } = req.body;
      const { order_id } = req.params;
      const newProduct = {
        order_id,
        product_id,
        quantity,
        price,
        observation
      }
      const errorValidator = validator.validate(newProduct, 'orderProd')
      if (errorValidator){
        return res.status(400).json({error : errorValidator});
      }
      return OrderProductService.insertProduct(req.app.get('db'), newProduct)
        .then(product => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${product.id}`))
            .json(Utils.serialize(product))
        })
    })

    ordersRoute
      .route('/:order_id/products/:product_id')
      .all((req, res, next) => {
      const { order_id, product_id } = req.params
      OrderProductService.getById(req.app.get('db'), order_id, product_id)
        .then(product => {
          if (!product) {
            //logger.error(`Order with id ${order_id} not found.`)
            return res.status(404).json({
              error: { message: `Order Not Found` }
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
      const { order_id, product_id } = req.params
      OrderProductService.deleteProduct(
        req.app.get('db'),
        order_id,
        product_id
      )
      .then(numRowsAffected => {
        //logger.info(`Card with id ${bookmark_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { quantity, price, observation } = req.body;
      let productToUpdate = {
        quantity,
        price,
        observation
      };
      //const requiredFields = { quantity, price };
      //productToUpdate = Utils.removeEmpty(requiredFields, productToUpdate);
      const errorValidator = validator.validate(productToUpdate, 'orderProd', false)
      if (errorValidator){
        return res.status(400).json(errorValidator);
      }
      OrderProductService.updateProduct(
        req.app.get('db'),
        req.params.order_id,
        req.params.product_id,
        productToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })

    ordersRoute
      .route('/:order_id/promotions/')
      .get((req, res, next) => {
        const { order_id } = req.params;
        OrderPromotionService.getAllOrderPromotion(req.app.get('db'), order_id)
          .then(orderProms => {
            res.json(orderProms.map(Utils.serialize))
          })
          .catch(next)
      })
      .post(jsonParser, (req, res, next) => {
        const { quantity, promotion_id, price, observation } = req.body;
        const { order_id } = req.params;
        const newPromotion = {
          order_id,
          promotion_id,
          quantity,
          price,
          observation
        }
        const errorValidator = validator.validate(newPromotion, 'orderProm')
        if (errorValidator){
          return res.status(400).json({error : errorValidator});
        }
        return OrderPromotionService.insertProduct(req.app.get('db'), newPromotion)
          .then(promotion => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${promotion.id}`))
              .json(Utils.serialize(promotion))
          })
      })

      ordersRoute
        .route('/:order_id/promotions/:promotion_id')
        .all((req, res, next) => {
        const { order_id, promotion_id } = req.params
        OrderPromotionService.getById(req.app.get('db'), order_id, promotion_id)
          .then(promotion => {
            if (!promotion) {
              //logger.error(`Order with id ${order_id} not found.`)
              return res.status(404).json({
                error: { message: `Order Not Found` }
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
        const { order_id, promotion_id } = req.params
        OrderPromotionService.deleteProduct(
          req.app.get('db'),
          order_id,
          promotion_id
        )
        .then(numRowsAffected => {
          //logger.info(`Card with id ${bookmark_id} deleted.`)
          res.status(204).end()
        })
        .catch(next)
      })
      .patch(jsonParser, (req, res, next) => {
        const { quantity, price, observation } = req.body;
        let promotionToUpdate = {
          quantity,
          price,
          observation
        };
        //const requiredFields = { quantity, price };
        //promotionToUpdate = Utils.removeEmpty(requiredFields, promotionToUpdate);
        const errorValidator = validator.validate(promotionToUpdate, 'orderProm', false)
        if (errorValidator){
          return res.status(400).json(errorValidator);
        }
        OrderPromotionService.updateProduct(
          req.app.get('db'),
          req.params.order_id,
          req.params.promotion_id,
          promotionToUpdate
        )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
      })

  module.exports = ordersRoute;
