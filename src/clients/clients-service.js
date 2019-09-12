
const ClientsService = {
  getAllClients(db) {
    return db.select('*').from('clients').where({status:'Active'})
  },
  getById(db, id) {
    return db.from('clients').select('*').where({id, status:'Active'}).first()
  },

  insertClient(db, newClient){
    return db
      .insert(newClient)
      .into('clients')
      .returning('*')
      .then(([client]) => client)
  },

  updateClient(db, id, newClient){
    return db
      .into('clients')
      .where({ id })
      .update(newClient);
  },

  inactiveClient(db, id){
    return db
      .into('clients')
      .where({ id })
      .update({ status: 'Inactive' });
  },
}

module.exports = ClientsService
