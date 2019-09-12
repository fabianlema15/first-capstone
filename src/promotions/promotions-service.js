
const PromotionsService = {
  getAllPromotions(db) {
    return db.select('*').from('promotions').where({status:'Active'})
  },
  getById(db, id) {
    return db.from('promotions').select('*').where({id, status:'Active'}).first()
  },

  insertPromotion(db, newPromotion){
    return db
      .insert(newPromotion)
      .into('promotions')
      .returning('*')
      .then(([promotion]) => promotion)
  },

  updatePromotion(db, id, newPromotion){
    return db
      .into('promotions')
      .where({ id })
      .update(newPromotion);
  },

  inactivePromotion(db, id){
    return db
      .into('promotions')
      .where({ id })
      .update({ status: 'Inactive' });
  },
}

module.exports = PromotionsService
