
const OrderPromotionService = {
  getAllOrderPromotion(db, order_id) {
    return db.select('*').from('order_promotion').where({order_id})
  },
  getById(db, order_id, promotion_id) {
    return db.from('order_promotion').select('*').where({ order_id, promotion_id }).first()
  },

  insertProduct(db, newPromotion){
    return db
      .insert(newPromotion)
      .into('order_promotion')
      .returning('*')
      .then(([promotion]) => promotion)
  },

  updateProduct(db, order_id, promotion_id, newPromotion){
    return db
      .into('order_promotion')
      .where({ order_id, promotion_id })
      .update(newPromotion);
  },

  deleteProduct(db, order_id, promotion_id){
    return db
      .into('order_promotion')
      .where({ order_id, promotion_id })
      .delete();
  },
}

module.exports = OrderPromotionService
