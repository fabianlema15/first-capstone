const express = require('express');
const ordersRoute = express.Router();
const jsonParser = express.json();
const OrdersService = require('./orders-service');
const OrderProductService = require('./order-prod-service');
const OrderPromotionService = require('./order-prom-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');
const mail = require('../utils/mail');

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
    .route('/byuser/:user_id')
    .get((req, res, next) => {
      OrdersService.getAllByUser(req.app.get('db'), req.params.user_id)
        .then(orders => {
          res.json(orders.map(Utils.serialize))
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
      OrderProductService.hasOrderWithProduct(req.app.get('db'), order_id, product_id)
        .then(exist => {
          if (exist)
            return res.status(400).json({error: 'The order already has the selected product!'})
          return OrderProductService.insertProduct(req.app.get('db'), newProduct)
            .then(product => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${product.id}`))
                .json(Utils.serialize(product))
            })
        }).catch(next)

    })

    ordersRoute
      .route('/:order_id/products/:product_id')
      .all((req, res, next) => {
      const { order_id, product_id } = req.params
      OrderProductService.getById(req.app.get('db'), order_id, product_id)
        .then(product => {
          if (!product) {
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
        product_id,
        res.product
      )
      .then(order => {
        res.status(201).json(order)
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
        OrderPromotionService.hasOrderWithPromotion(req.app.get('db'), order_id, promotion_id)
          .then(exist => {
            if (exist)
              return res.status(400).json({error: 'The order already has the selected promotion!'})

            return OrderPromotionService.insertProduct(req.app.get('db'), newPromotion)
              .then(promotion => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${promotion.id}`))
                  .json(Utils.serialize(promotion))
              })
          }).catch(next)
      })

      ordersRoute
        .route('/:order_id/promotions/:promotion_id')
        .all((req, res, next) => {
        const { order_id, promotion_id } = req.params
        OrderPromotionService.getById(req.app.get('db'), order_id, promotion_id)
          .then(promotion => {
            if (!promotion) {
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
          promotion_id,
          res.promotion
        )
        .then(order => {
          res.status(201).json(order)
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

  ordersRoute
    .route('/filter/:user_id/:from/:to')
    .get((req, res, next) => {
      const {user_id, from, to } = req.params;
      OrdersService.getByUserDate(req.app.get('db'), user_id, from, to)
        .then(orders => {
          res.json(orders.map(Utils.serialize))
        })
        .catch(next)
    })

  ordersRoute
    .route('/send/mail')
    .post(jsonParser, (req, res, next) => {
      const {mail_to, user_id, from, to } = req.body;
      OrdersService.getByUserDate(req.app.get('db'), user_id, from, to)
        .then(orders => {
          mail.send(mail_to, orders)
          res.status(201).json({message: 'OK'});
        })
        .catch(next)
    })

  module.exports = ordersRoute;
