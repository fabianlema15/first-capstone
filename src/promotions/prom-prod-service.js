
const PromotionDetailService = {
  getAllPromotionDetail(db, promotion_id) {
    return db.select('*').from('promotion_product').where({ promotion_id })
  },
  getById(db, promotion_id, product_id) {
    return db.from('promotion_product').select('*').where({ promotion_id, product_id }).first()
  },

  insertProduct(db, newPromotion){
    return db
      .insert(newPromotion)
      .into('promotion_product')
      .returning('*')
      .then(([promotion]) => promotion)
  },

  updateProduct(db, promotion_id, product_id, newProduct){
    return db
      .into('promotion_product')
      .where({ promotion_id, product_id })
      .update(newProduct);
  },

  deleteProduct(db, promotion_id, product_id){
    return db
      .into('promotion_product')
      .where({ promotion_id, product_id })
      .delete();
  },
}

module.exports = PromotionDetailService
