const express = require('express');
const clientsRoute = express.Router();
const jsonParser = express.json();
const ClientsService = require('./clients-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');

clientsRoute
  .route('/')
  .get((req, res, next) => {
    ClientsService.getAllClients(req.app.get('db'))
      .then(clients => {
        res.json(clients.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { full_name, address, phone, email } = req.body
    const newClient = {
      full_name,
      address,
      phone,
      email
    }
    const errorValidator = validator.validate(newClient, 'client')
    if (errorValidator){
      return res.status(400).json({error : errorValidator});
    }
    return ClientsService.insertClient(req.app.get('db'), newClient)
      .then(client => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${client.id}`))
          .json(Utils.serialize(client))
      })
  })

  clientsRoute
    .route('/:client_id')
    .all((req, res, next) => {
    const { client_id } = req.params
    ClientsService.getById(req.app.get('db'), client_id)
      .then(client => {
        if (!client) {
          return res.status(404).json({
            error: { message: `Client Not Found` }
          })
        }
        res.client = client
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(Utils.serialize(res.client))
  })
  .delete((req, res, next) => {
    const { client_id } = req.params
    ClientsService.inactiveClient(
      req.app.get('db'),
      client_id
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { full_name, address, phone, email } = req.body;
    let clientToUpdate = { full_name,
      address,
      phone,
      email
    };
    const errorValidator = validator.validate(clientToUpdate, 'client', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }
    ClientsService.updateClient(
      req.app.get('db'),
      req.params.client_id,
      clientToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  module.exports = clientsRoute;
