const OrdersService = require('./orders-service');
const { TAX_PERCENT } = require('../config')

const OrderPromotionService = {
  getAllOrderPromotion(db, order_id) {
    return db.from('order_promotion as ordprom')
    .select(
      'ordprom.id',
      'ordprom.quantity',
      'ordprom.price',
      'ordprom.observation',
      'ordprom.promotion_id',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prms.id,
                prms.name,
                prms.stock
            ) tmp)
          ) AS "promotion"`
        )
    )
    .leftJoin(
        'promotions AS prms',
        'ordprom.promotion_id',
        'prms.id',
      )
    .where({order_id})
  },

  hasOrderWithPromotion(db, order_id, promotion_id) {
    return db.from('order_promotion')
    .where({ order_id, promotion_id })
    .first()
    .then(orderDetail => !!orderDetail)
  },

  getByIdAndOrder(db, order_id, promotion_id) {
    return db.from('order_promotion as ordprom')
    .select(
      'ordprom.id',
      'ordprom.quantity',
      'ordprom.price',
      'ordprom.observation',
      'ordprom.promotion_id',
      'orders.subtotal',
      'orders.tax',
      'orders.total',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prms.id,
                prms.name,
                prms.stock
            ) tmp)
          ) AS "promotion"`
        )
    )
    .leftJoin(
        'promotions AS prms',
        'ordprom.promotion_id',
        'prms.id',
      )
    .leftJoin(
        'orders',
        'ordprom.order_id',
        'orders.id',
      )
    .where({ order_id, promotion_id })
    .first()
  },

  getById(db, order_id, promotion_id) {
    return db.from('order_promotion as ordprom')
    .select(
      'ordprom.id',
      'ordprom.quantity',
      'ordprom.price',
      'ordprom.observation',
      'ordprom.promotion_id',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prms.id,
                prms.name,
                prms.stock
            ) tmp)
          ) AS "promotion"`
        )
    )
    .leftJoin(
        'promotions AS prms',
        'ordprom.promotion_id',
        'prms.id',
      )
    .where({ order_id, promotion_id })
    .first()
  },

  insertProduct(db, newPromotion){
    return db
      .insert(newPromotion)
      .into('order_promotion')
      .returning('*')
      .then(([promotion]) => promotion)
      .then(promotion => db
        .into('products')
        .whereIn('id', function () { this.select('product_id').from('promotion_product').where({promotion_id:newPromotion.promotion_id}); })
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
      .then(promotion =>
        OrderPromotionService.getByIdAndOrder(db, promotion.order_id, promotion.promotion_id)
      )
  },

  updateProduct(db, order_id, promotion_id, newPromotion){
    return db
      .into('order_promotion')
      .where({ order_id, promotion_id })
      .update(newPromotion);
  },

  deleteProduct(db, order_id, promotion_id, promotion){
    return db
      .into('products')
      .whereIn('id', function () { this.select('product_id').from('promotion_product').where({promotion_id:promotion.promotion_id}); })
      .update({
        'stock': db.raw(`stock + ${promotion.quantity}`)
      })
      .then(() => db
        .into('orders')
        .where({id: order_id})
        .update({
          'subtotal': db.raw(`subtotal - ${promotion.price}`),
          'tax': db.raw(`(subtotal + ${promotion.price}) * ${parseFloat(TAX_PERCENT)}`),
          'total': db.raw(`(subtotal + ${promotion.price}) * (${parseFloat(TAX_PERCENT)} + 1)`)
        })
      )
      .then(() => db
        .into('order_promotion')
        .where({ order_id, promotion_id })
        .delete())
      .then(() => OrdersService.getById(db, order_id))
  },
}

module.exports = OrderPromotionService
