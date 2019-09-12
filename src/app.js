require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRoute = require('./users/users-route');
const productsRoute = require('./products/products-route');
const clientsRoute = require('./clients/clients-route');
const promotionsRoute = require('./promotions/promotions-route');
const ordersRoute = require('./orders/orders-route');
const salesRoute = require('./sales/sales-route');
const authRouter = require('./auth/auth-router')
const { requireAuth } = require('./utils/jwt-auth');
const logger = require('./utils/logger');

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(requireAuth);

app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.use('/api/clients', clientsRoute);
app.use('/api/promotions', promotionsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/sales', salesRoute);
app.use('/api/sales', salesRoute);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
})

app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
     logger.error(error.message)
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

module.exports = app
