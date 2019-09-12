
const ProductsService = {
  getAllProducts(db) {
    return db.select('*').from('products').where({status:'Active'})
  },
  getById(db, id) {
    return db.from('products').select('*').where({id, status:'Active'}).first()
  },

  insertProduct(db, newProduct){
    return db
      .insert(newProduct)
      .into('products')
      .returning('*')
      .then(([product]) => product)
  },

  updateProduct(db, id, newProduct){
    return db
      .into('products')
      .where({ id })
      .update(newProduct);
  },

  inactiveProduct(db, id){
    return db
      .into('products')
      .where({ id })
      .update({ status: 'Inactive' });
  },
}

module.exports = ProductsService
