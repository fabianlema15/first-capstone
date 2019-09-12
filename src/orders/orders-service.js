
const OrdersService = {
  getAllOrders(db) {
    return db.select('*').from('orders').where({status:'Active'})
  },
  getById(db, id) {
    return db.from('orders').select('*').where({id, status:'Active'}).first()
  },

  insertOrder(db, newOrder){
    return db
      .insert(newOrder)
      .into('orders')
      .returning('*')
      .then(([order]) => order)
  },

  updateOrder(db, id, newOrder){
    return db
      .into('orders')
      .where({ id })
      .update(newOrder);
  },

  inactiveOrder(db, id){
    return db
      .into('orders')
      .where({ id })
      .update({ status: 'Inactive' });
  },
}

module.exports = OrdersService
