const Joi = require('@hapi/joi');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const SPACE_PUNTUATION = /^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/

const schemasNew = {
  user:Joi.object().keys({
      user_code: Joi.number().integer().min(0).max(999999).required(),
      first_name: Joi.string().regex(SPACE_PUNTUATION).min(2).max(100).required(),
      last_name: Joi.string().regex(SPACE_PUNTUATION).min(2).max(100).required(),
      address: Joi.string().regex(SPACE_PUNTUATION).allow('').max(200),
      phone: Joi.string().regex(SPACE_PUNTUATION).allow('').max(100),
      email: Joi.string().email({ minDomainSegments: 2 }).allow('').max(100),
      role: Joi.string().alphanum().min(2).max(10).required(),
      password: Joi.string().regex(REGEX_UPPER_LOWER_NUMBER_SPECIAL).required(),
  }),
  product:Joi.object().keys({
      name: Joi.string().regex(SPACE_PUNTUATION).min(2).max(100).required(),
      picture: Joi.string().min(2).max(100).required(),
      description: Joi.string().regex(SPACE_PUNTUATION).allow(''),
      stock: Joi.number().integer().min(0).required(),
      price: Joi.number().min(0).required()
  }),
  client:Joi.object().keys({
      full_name: Joi.string().regex(SPACE_PUNTUATION).min(2).max(200).required(),
      address: Joi.string().regex(SPACE_PUNTUATION).allow('').max(200),
      phone: Joi.string().regex(SPACE_PUNTUATION).allow('').max(100),
      email: Joi.string().email({ minDomainSegments: 2 }).allow('').max(100),
  }),
  promotion:Joi.object().keys({
      name: Joi.string().regex(SPACE_PUNTUATION).min(2).max(200).required(),
      picture: Joi.string().min(2).max(100).required(),
      description: Joi.string().regex(SPACE_PUNTUATION).allow(''),
      stock: Joi.number().integer().min(0).required(),
      price: Joi.number().min(0).required()
  }),
  promProd:Joi.object().keys({
      promotion_id: Joi.number().integer().min(1).required(),
      product_id: Joi.number().integer().min(1).required(),
      quantity: Joi.number().integer().min(1).required(),
  }),
  order:Joi.object().keys({
      user_id: Joi.number().integer().min(1).required(),
      client_id: Joi.number().integer().min(1).required(),
      observation: Joi.string().regex(SPACE_PUNTUATION).allow(''),
      subtotal: Joi.number().min(0).required(),
      tax: Joi.number().min(0).required(),
      total: Joi.number().min(0).required(),
  }),
  orderProm:Joi.object().keys({
      promotion_id: Joi.number().integer().min(1).required(),
      order_id: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().integer().min(1).required(),
      observation: Joi.string().regex(SPACE_PUNTUATION).allow(''),
  }),
  orderProd:Joi.object().keys({
      product_id: Joi.number().integer().min(1).required(),
      order_id: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().integer().min(1).required(),
      observation: Joi.string().regex(SPACE_PUNTUATION).allow(''),
  }),
  dailySale:Joi.object().keys({
      user_id: Joi.number().integer().min(1).required(),
      number_sales: Joi.number().integer().min(0).required(),
      subtotal: Joi.number().min(0).required(),
      tax: Joi.number().min(0).required(),
      total: Joi.number().min(0).required(),
      observation: Joi.string().regex(SPACE_PUNTUATION).allow(''),
      date_sale: Joi.string().regex(SPACE_PUNTUATION).min(2).max(200).required(),
  }),
}

const schemasOld = {
  user:schemasNew.user.optionalKeys("user_code", "first_name", "last_name", "role", "password"),
  product:schemasNew.product.optionalKeys("name", "picture", "stock", "price"),
  client:schemasNew.client.optionalKeys("full_name"),
  promotion:schemasNew.promotion.optionalKeys("name", "picture", "stock", "price"),
  promProd:schemasNew.promProd.optionalKeys("promotion_id", "product_id", "quantity"),
  order:schemasNew.order.optionalKeys("user_id", "client_id", "subtotal", "tax", "total"),
  orderProm:schemasNew.orderProm.optionalKeys("promotion_id", "order_id", "price", "quantity"),
  orderProd:schemasNew.orderProd.optionalKeys("product_id", "order_id", "price", "quantity"),
  dailySale:schemasNew.dailySale.optionalKeys("user_id", "number_sales", "subtotal", "tax", "total", "date_sale"),
}

const validator = {
  validate(objectData, objectSended, isNew = true){
    let result;
    if (isNew)
      result = Joi.validate(objectData, schemasNew[objectSended]);
    else
      result = Joi.validate(objectData, schemasOld[objectSended]);

    if ( result.error != null){
      return result.error.details.map(detail => detail.message)
    }
  }
}

module.exports = validator;
