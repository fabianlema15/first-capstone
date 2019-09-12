const bcyrpt = require('bcryptjs')

const UsersService = {
  hashPassword(password){
    return bcyrpt.hash(password, 8)
  },

  hasUserWithUserCode(db, user_code){
    return db('users')
      .where({user_code})
      .first()
      .then(user => !!user)
  },

  getAllUsers(db) {
    return db.select('*').from('users').where({status:'Active'})
  },

  getAllRoles(db) {
    return db.raw('SELECT unnest(enum_range(NULL::roles))::text as roles')
  },

  getByRole(db, role) {
    return db.select('*').from('users').where({status:'Active', role})
  },

  getById(db, id) {
    return db.from('users').select('*').where({id, status:'Active'}).first()
  },

  insertUser(db, newUser){
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },

  updateUser(db, id, newUser){
    return db
      .into('users')
      .where({ id })
      .update(newUser);
  },

  inactiveUser(db, id){
    return db
      .into('users')
      .where({ id })
      .update({ status: 'Inactive' });
  },
}

module.exports = UsersService
