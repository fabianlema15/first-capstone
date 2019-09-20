const express = require('express');
const usersRoute = express.Router();
const jsonParser = express.json();
const UsersService = require('./users-service');
const Utils = require('../utils/utils');
const path = require('path');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

usersRoute
  .route('/')
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(users.map(Utils.serialize))
      })
      .catch(next)
  })
  .post(jsonParser, async (req, res, next) => {
    const { first_name, last_name, address, phone, email, role } = req.body;
    let taken = true;
    while (taken){
      let user_code = Utils.generateCodeUser();
      try{
        taken = await UsersService.hasUserWithUserCode(req.app.get('db'), user_code);
        if (!taken){
          const hashedPassword = await UsersService.hashPassword(user_code);
          const newUser = {
            user_code,
            first_name,
            last_name,
            address,
            phone,
            email,
            role,
            password: hashedPassword
          }
          const errorValidator = validator.validate(newUser, 'user')
          if (errorValidator){
            return res.status(400).json({error : errorValidator});
          }
          const user = await UsersService.insertUser(req.app.get('db'), newUser);
          logger.info(`User created.`)
          return res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(Utils.serialize(user))
        }
      }catch(e){
        next(e);
      }
    }
  })

  usersRoute
    .route('/:user_id')
    .all((req, res, next) => {
    const { user_id } = req.params
    UsersService.getById(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          logger.error(`User with id ${user_id} not found.`)
          return res.status(404).json({
            error: { message: `User Not Found` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(Utils.serialize(res.user))
  })
  .delete((req, res, next) => {
    const { user_id } = req.params
    UsersService.inactiveUser(
      req.app.get('db'),
      user_id
    )
    .then(numRowsAffected => {
      logger.info(`User with id ${user_id} inactivated.`)
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {

    const { user_code, first_name, last_name, address, phone, email, role, password } = req.body;
    let userToUpdate = {
      user_code,
      first_name,
      last_name,
      address,
      phone,
      email,
      role,
      password
    };

    const errorValidator = validator.validate(userToUpdate, 'user', false)
    if (errorValidator){
      return res.status(400).json(errorValidator);
    }

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

  usersRoute
    .route('/is/:user_code')
    .get((req, res, next) => {
      UsersService.hasUserWithUserCode(req.app.get('db'), req.params.user_code)
        .then(exist => {
          if(exist)
            return res.json({
              message: 'ok'
            })
          else
            return res.status(404).json({
              error: 'User Not Found'
            })
        })
        .catch(next);
    })

  usersRoute
    .route('/type/:type')
    .get((req, res, next) => {
      UsersService.getAllRoles(req.app.get('db'))
        .then(roles => {
          res.json(roles.rows);
        })
        .catch(next);
    })

  usersRoute
    .route('/get/:type')
    .get((req, res, next) => {
      switch(req.params.type){
        case 'roles':
          UsersService.getAllRoles(req.app.get('db'))
            .then(roles => {
              res.json(roles.rows);
            })
            .catch(next);
          break;
        default:
          res.json({error: 'No type inserted'})
      }

    })

  usersRoute
    .route('/getbyrol/:role')
    .get((req, res, next) => {
      if (req.params.role)
        UsersService.getByRole(req.app.get('db'), req.params.role)
          .then(users => {
            res.json(users.map(Utils.serialize));
          })
          .catch(next);
      else
        res.status(400).json({error: 'You need send information about role'})

    })

  module.exports = usersRoute;
