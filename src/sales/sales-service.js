
const DailySalesService = {
  getAllDailySales(db) {
    return db.select('*').from('daily_sales')
  },

  getById(db, id) {
    return db.from('daily_sales').select('*').where({ id }).first()
  },

  getByColumn(db, column, from, to) {
    return db.from('daily_sales').select('*')
        .where(column, '>=', `${from}T00:00:00Z`)
        .where(column, '<', `${to}T23:59:59`)
  },

  getByUserColumn(db, user_id, column, from, to) {
    return db.from('daily_sales').select('*')
        .where({user_id})
        .where(column, '>=', `${from}T00:00:00Z`)
        .where(column, '<', `${to}T23:59:59`)
  },

  insertDailySale(db, newDailySale){
    return db
      .insert(newDailySale)
      .into('daily_sales')
      .returning('*')
      .then(([product]) => product)
  },

  updateDailySale(db, id, newDailySale){
    return db
      .into('daily_sales')
      .where({ id })
      .update(newDailySale);
  },

  deleteDailySale(db, id){
    return db
      .into('daily_sales')
      .where({ id })
      .delete();
  },
}

module.exports = DailySalesService
