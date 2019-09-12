const express = require('express');
const productsRoute = express.Router();
const jsonParser = express.json();
const ProductsService = require('./products-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');

productsRoute
  .route('/')
  .get((req, res, next) => {
    ProductsService.getAllProducts(req.app.get('db'))
      .then(products => {
        res.json(products.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, picture, decription, stock, price } = req.body
    const newProduct = {
      name,
      picture,
      decription,
      stock,
      price
    }
    const errorValidator = validator.validate(newProduct, 'product')
    if (errorValidator){
      return res.status(400).json({error : errorValidator});
    }
    return ProductsService.insertProduct(req.app.get('db'), newProduct)
      .then(product => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${product.id}`))
          .json(Utils.serialize(product))
      })
  })

  productsRoute
    .route('/:product_id')
    .all((req, res, next) => {
    const { product_id } = req.params
    ProductsService.getById(req.app.get('db'), product_id)
      .then(product => {
        if (!product) {
          //logger.error(`Product with id ${product_id} not found.`)
          return res.status(404).json({
            error: { message: `Product Not Found` }
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
    const { product_id } = req.params
    ProductsService.inactiveProduct(
      req.app.get('db'),
      product_id
    )
    .then(numRowsAffected => {
      //logger.info(`Card with id ${bookmark_id} deleted.`)
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, picture, decription, stock, price } = req.body;
    let productToUpdate = {
      name,
      picture,
      decription,
      stock,
      price
    };
    //const requiredFields = { name, picture, stock, price };
    //productToUpdate = Utils.removeEmpty(requiredFields, productToUpdate);
    const errorValidator = validator.validate(productToUpdate,'product', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }

    ProductsService.updateProduct(
      req.app.get('db'),
      req.params.product_id,
      productToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  module.exports = productsRoute;
