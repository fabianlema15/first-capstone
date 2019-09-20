
const PromotionDetailService = {
  getAllPromotionDetail(db, promotion_id) {
    return db.select('*').from('promotion_product').where({ promotion_id })
  },
  getById(db, promotion_id, product_id) {
    return db.from('promotion_product as proprod')
    .select(
      'proprod.id',
      'proprod.quantity',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                prds.id,
                prds.name,
                prds.stock
            ) tmp)
          ) AS "product"`
        )
    )
    .leftJoin(
        'products AS prds',
        'proprod.product_id',
        'prds.id',
      )
    .where({ promotion_id, product_id }).first()
  },
  insertProduct(db, newPromotion){
    return db
      .insert(newPromotion)
      .into('promotion_product')
      .returning('*')
      .then(([promotion]) => promotion)
      .then(promotion =>
        PromotionDetailService.getById(db, promotion.promotion_id, promotion.product_id)
      )
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
