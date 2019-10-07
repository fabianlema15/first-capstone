const express = require('express');
const dailySalesRoute = express.Router();
const jsonParser = express.json();
const DailySalesService = require('./sales-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');

dailySalesRoute
  .route('/')
  .get((req, res, next) => {
    DailySalesService.getAllDailySales(req.app.get('db'))
      .then(sales => {
        res.json(sales.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, number_sales, subtotal, tax, total, observation, date_sale } = req.body
    const newDailySale = {
      user_id,
      number_sales,
      subtotal,
      tax,
      total,
      observation,
      date_sale
    }
    const errorValidator = validator.validate(newDailySale, 'dailySale')
    if (errorValidator){
      return res.status(400).json({error : errorValidator});
    }
    return DailySalesService.insertDailySale(req.app.get('db'), newDailySale)
      .then(dailySale => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${dailySale.id}`))
          .json(Utils.serialize(dailySale))
      })
  })

  dailySalesRoute
    .route('/:sale_id')
    .all((req, res, next) => {
    const { sale_id } = req.params
    DailySalesService.getById(req.app.get('db'), sale_id)
      .then(dailySale => {
        if (!dailySale) {
          return res.status(404).json({
            error: { message: `DailySale Not Found` }
          })
        }
        res.dailySale = dailySale
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(Utils.serialize(res.dailySale))
  })
  .delete((req, res, next) => {
    const { sale_id } = req.params
    DailySalesService.deleteDailySale(
      req.app.get('db'),
      sale_id
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id, number_sales, subtotal, tax, total, observation, date_sale } = req.body;
    let dailySaleToUpdate = {
      user_id,
      number_sales,
      subtotal,
      tax,
      total,
      observation,
      date_sale
    };
    const errorValidator = validator.validate(dailySaleToUpdate, 'dailySale', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }
    DailySalesService.updateDailySale(
      req.app.get('db'),
      req.params.sale_id,
      dailySaleToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

dailySalesRoute
  .route('/filterby/:column/:from/:to')
  .get((req, res, next) => {
    const {column, from, to } = req.params;
    if (column === 'date_sale'){
      DailySalesService.getByColumn(req.app.get('db'), column, from, to)
        .then(sales => {
          res.json(sales.map(Utils.serialize))
        })
        .catch(next)
    }else{
      res.status(400).json({error: 'Column does not exist'})
    }
  })

  dailySalesRoute
    .route('/filterbyuser/:user_id/:column/:from/:to')
    .get((req, res, next) => {
      const {user_id, column, from, to } = req.params;
      if (column === 'date_sale'){
        DailySalesService.getByUserColumn(req.app.get('db'), user_id, column, from, to)
          .then(sales => {
            res.json(sales.map(Utils.serialize))
          })
          .catch(next)
      }else{
        res.status(400).json({error: 'Column does not exist'})
      }
    })

  module.exports = dailySalesRoute;
