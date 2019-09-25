const OrdersService = require('./orders-service');
const { TAX_PERCENT } = require('../config')

const OrderProductService = {
  getAllOrderProduct(db, order_id) {
    return db.from('order_product as ordprod')
    .select(
      'ordprod.id',
      'ordprod.quantity',
      'ordprod.price',
      'ordprod.observation',
      'ordprod.product_id',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prds.id,
                prds.name
            ) tmp)
          ) AS "product"`
        )
    )
    .leftJoin(
        'products AS prds',
        'ordprod.product_id',
        'prds.id',
      )
    .where({order_id})
  },

  hasOrderWithProduct(db, order_id, product_id) {
    return db.from('order_product')
    .where({ order_id, product_id })
    .first()
    .then(orderDetail => !!orderDetail)
  },

  getByIdAndOrder(db, order_id, product_id) {
    return db.from('order_product as ordprod')
    .select(
      'ordprod.id',
      'ordprod.quantity',
      'ordprod.price',
      'ordprod.observation',
      'ordprod.product_id',
      'orders.subtotal',
      'orders.tax',
      'orders.total',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prds.id,
                prds.name
            ) tmp)
          ) AS "product"`
        )
    )
    .leftJoin(
        'products AS prds',
        'ordprod.product_id',
        'prds.id',
      )
    .leftJoin(
        'orders',
        'ordprod.order_id',
        'orders.id',
      )
    .where({ order_id, product_id })
    .first()
  },

  getById(db, order_id, product_id) {
    return db.from('order_product as ordprod')
    .select(
      'ordprod.id',
      'ordprod.quantity',
      'ordprod.price',
      'ordprod.observation',
      'ordprod.product_id',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prds.id,
                prds.name
            ) tmp)
          ) AS "product"`
        )
    )
    .leftJoin(
        'products AS prds',
        'ordprod.product_id',
        'prds.id',
      )
    .where({ order_id, product_id })
    .first()
  },

  insertProduct(db, newProduct){
    return db
      .insert(newProduct)
      .into('order_product')
      .returning('*')
      .then(([promotion]) => promotion)
      .then(promotion => db
        .into('products')
        .where({id: promotion.product_id})
        .update({
          'stock': db.raw(`stock - ${promotion.quantity}`)
        })
        .then(() => promotion)
      )
      .then(promotion => db
        .into('orders')
        .where({id: promotion.order_id})
        .update({
          'subtotal': db.raw(`subtotal + ${promotion.price}`),
          'tax': db.raw(`(subtotal + ${promotion.price}) * ${parseFloat(TAX_PERCENT)}`),
          'total': db.raw(`(subtotal + ${promotion.price}) * (${parseFloat(TAX_PERCENT)} + 1)`)
        })
        .then(() => promotion)
      )
      .then(promotion => OrderProductService.getByIdAndOrder(db, promotion.order_id, promotion.product_id))
  },

  updateProduct(db, order_id, product_id, newProduct){
    return db
      .into('order_product')
      .where({ order_id, product_id })
      .update(newProduct);
  },

  deleteProduct(db, order_id, product_id, promotion){
    return db
      .into('products')
      .where({id: promotion.product_id})
      .update({
        'stock': db.raw(`stock + ${promotion.quantity}`)
      })
      .then(() => db
        .into('orders')
        .where({id: order_id})
        .update({
          'subtotal': db.raw(`subtotal - ${promotion.price}`),
          'tax': db.raw(`(subtotal - ${promotion.price}) * ${parseFloat(TAX_PERCENT)}`),
          'total': db.raw(`(subtotal - ${promotion.price}) * (${parseFloat(TAX_PERCENT)} + 1)`)
        })
      )
      .then(() => db
        .into('order_product')
        .where({ order_id, product_id })
        .delete())
      .then(() => OrdersService.getById(db, order_id))
  },

  updateProductStock(db, id, quantity){
    return db
    .into('products')
    .returning(['id','stock'])
    .where({id})
    .update({
      'stock': db.raw(`stock - ${quantity}`)
    })
    //
    .then(obj => console.log(obj))
  }
}

module.exports = OrderProductService
