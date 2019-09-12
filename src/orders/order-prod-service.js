
const OrderProductService = {
  getAllOrderProduct(db, order_id) {
    return db.select('*').from('order_product').where({order_id})
  },
  
  getById(db, order_id, product_id) {
    return db.from('order_product').select('*').where({ order_id, product_id }).first()
  },

  insertProduct(db, newProduct){
    return db
      .insert(newProduct)
      .into('order_product')
      .returning('*')
      .then(([promotion]) => promotion)
  },

  updateProduct(db, order_id, product_id, newProduct){
    return db
      .into('order_product')
      .where({ order_id, product_id })
      .update(newProduct);
  },

  deleteProduct(db, order_id, product_id){
    return db
      .into('order_product')
      .where({ order_id, product_id })
      .delete();
  },
}

module.exports = OrderProductService
