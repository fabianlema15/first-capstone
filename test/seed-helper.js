const helper = require('./test-helper');
const bcrypt = require('bcryptjs');

/*function seedUsers(db) {
  const users = helper.makeUsersArray();
  return seedRoles(db)
  .then(() => db
    .into('users')
    .insert(users))
}*/

function seedUsers(db) {
  const users = helper.makeUsersArray();
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into('users')
    .insert(preppedUsers);
}

function seedProducts(db) {
  const products = helper.makeProductsArray();
  return db
    .into('products')
    .insert(products);
}

function seedClients(db) {
  const clients = helper.makeClientsArray();
  return db
    .into('clients')
    .insert(clients);
}

function seedPromotions(db) {
  const promotions = helper.makePromotionsArray();
  return db
    .into('promotions')
    .insert(promotions);
}

function seedPromotionProduct(db) {
  const promotion_detail = helper.makePromotionProductArray();
  return db
    .into('promotion_product')
    .insert(promotion_detail);
}

function seedOrders(db) {
  const orders = helper.makeOrdersArray();
  return db
    .into('orders')
    .insert(orders);
}

function seedOrderPromotion(db) {
  const order_promotion = helper.makeOrderPromotionArray();
  return db
    .into('order_promotion')
    .insert(order_promotion);
}

function seedOrderProduct(db) {
  const order_product = helper.makeOrderProductArray();
  return db
    .into('order_product')
    .insert(order_product);
}

function seedDailySales(db) {
  const daily_sales = helper.makeDailySaleArray();
  return db
    .into('daily_sales')
    .insert(daily_sales);
}

module.exports = {
  seedUsers,
  seedProducts,
  seedClients,
  seedPromotions,
  seedPromotionProduct,
  seedOrders,
  seedOrderPromotion,
  seedOrderProduct,
  seedDailySales
}
