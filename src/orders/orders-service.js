
const OrdersService = {
  getAllOrders(db) {
    return db.from('orders')
    .select(
      'orders.id',
      'orders.client_id',
      'orders.subtotal',
      'orders.tax',
      'orders.total',
      'orders.observation',
      db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                clients.id,
                clients.full_name
            ) tmp)
          ) AS "client"`
        )
    )
    .leftJoin(
        'clients',
        'orders.client_id',
        'clients.id',
      )
    .where({'orders.status':'Active'})
  },

  getAllByUser(db, user_id) {
    return db.from('orders')
      .select(
        'orders.id',
        'orders.client_id',
        'orders.subtotal',
        'orders.tax',
        'orders.total',
        'orders.observation',
        db.raw(
            `row_to_json(
              (SELECT tmp FROM (
                SELECT
                  clients.id,
                  clients.full_name
              ) tmp)
            ) AS "client"`
          )
      )
      .leftJoin(
          'clients',
          'orders.client_id',
          'clients.id',
      )
      .where({'orders.user_id':user_id, 'orders.status':'Active'})
  },

  getByUserDate(db, user_id, from, to) {
    return db.from('orders')
        .select(
          'orders.id',
          'orders.client_id',
          'orders.subtotal',
          'orders.tax',
          'orders.total',
          'orders.observation',
          db.raw(
              `row_to_json(
                (SELECT tmp FROM (
                  SELECT
                    clients.id,
                    clients.full_name
                ) tmp)
              ) AS "client"`
            )
        )
        .leftJoin(
            'clients',
            'orders.client_id',
            'clients.id',
          )
        .where({'orders.user_id': user_id, 'orders.status':'Active'})
        .where('orders.date_created', '>=', `${from}T00:00:00Z`)
        .where('orders.date_created', '<', `${to}T23:59:59`)
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
