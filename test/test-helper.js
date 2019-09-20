const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray(){
  return [{
    user_code: 112233,
    first_name: 'Fabian',
    last_name: 'Lema',
    address: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    phone: '3434545',
    email: 'fsdfsd@dgdfg.com',
    role: 'ADMIN',
    password: '112233'
  },{
    user_code: 223344,
    first_name: 'Marcelo',
    last_name: 'Lema',
    address: 'There',
    phone: '3453434545',
    email: 'fsdfsd@dgdfg.com',
    role: 'MANAGER',
    password: '223344',
    status:'Inactive'
  },{
    user_code: 223544,
    first_name: 'Marcelo33',
    last_name: 'Lema3',
    address: 'There3',
    phone: '34534345453',
    email: 'fsdfsd@dgdfg.com',
    role: 'MANAGER',
    password: '223344'
  }]
}

function makeClientsArray(){
  return [{
    id: 1,
    full_name: 'Fabian Lema',
    address: 'Here',
    phone: '3434545',
    email: 'fsdfsd@dgdfg.com'
  },{
    id: 2,
    full_name: 'Mana Lem',
    address: 'There',
    phone: '3453434545',
    email: 'fsdfsd@dgdfg.com'
  }]
}

function makeProductsArray(){
  return [{
    id: 1,
    name: 'Beer',
    picture: '/images/sdfsd.png',
    description: 'Nice',
    stock: 21,
    price: 4.23
  },{
    id: 2,
    name: 'Tequila',
    picture: '/images/tequ.png',
    description: 'Very nice',
    stock: 51,
    price: 6.23
  }]
}

function makePromotionsArray(){
  return [{
    id: 1,
    name: 'Promo 1',
    description: 'Promotion to test',
    stock: 343,
    price: 54.23,
    picture: './Url/to/picture.pns'
  },{
    id: 2,
    name: 'Promor 2',
    description: 'Promotion to test 2',
    stock: 63,
    price: 84.23,
    picture: 'Url/to/picture.pns'
  }]
}

function makePromotionProductArray(){
  return [{
    id: 1,
    promotion_id: 1,
    product_id: 1,
    quantity: 24
  },{
    id: 2,
    promotion_id: 1,
    product_id: 2,
    quantity: 54
  },{
    id: 3,
    promotion_id: 2,
    product_id: 2,
    quantity: 5
  }]
}

function makeOrdersArray(){
  return [{
    id: 1,
    user_id: 1,
    client_id: 1,
    subtotal: 34.54,
    tax: 23.42,
    total: 45.32,
    observation: 'Left at the blue house'
  },
  {
    id: 2,
    user_id: 2,
    client_id: 2,
    subtotal: 134.54,
    tax: 53.42,
    total: 245.32,
    observation: 'Left at the yellow house'
  },
  {
    id: 3,
    user_id: 1,
    client_id: 2,
    subtotal: 134.54,
    tax: 53.42,
    total: 245.32,
    observation: 'Left at the yellow house'
  }]
}

function makeOrderProductArray(){
  return [{
    id: 1,
    product_id: 1,
    order_id: 1,
    price: 3.34,
    quantity: 3,
    observation: '',
  },
  {
    id: 2,
    product_id: 2,
    order_id: 1,
    price: 5.34,
    quantity: 5,
    observation: 'Something',
  },
  {
    id: 3,
    product_id: 1,
    order_id: 2,
    price: 6.34,
    quantity: 1,
    observation: '',
  }]
}

function makeOrderPromotionArray(){
  return [{
    id: 1,
    promotion_id: 1,
    order_id: 1,
    price: 7.44,
    quantity: 3,
    observation: '',
  },
  {
    id: 2,
    promotion_id: 2,
    order_id: 1,
    price: 5.14,
    quantity: 1,
    observation: 'Something',
  },
  {
    id: 3,
    promotion_id: 2,
    order_id: 2,
    price: 6.84,
    quantity: 8,
    observation: '',
  }]
}

function makeDailySaleArray(){
  return [{
    id: 1,
    user_id: 1,
    number_sales: 32,
    subtotal: 43.12,
    tax: 4.34,
    total: 54.23,
    observation: '',
    date_sale: '2029-01-22T16:28:32.615Z'
  },
  {
    id: 2,
    user_id: 1,
    number_sales: 52,
    subtotal: 13.12,
    tax: 4.34,
    total: 24.23,
    observation: '',
    date_sale: '2029-01-23T16:28:32.615Z'
  },
  {
    id: 3,
    user_id: 2,
    number_sales: 32,
    subtotal: 53.12,
    tax: 4.34,
    total: 64.23,
    observation: '',
    date_sale: '2029-01-22T16:28:32.615Z'
  }]
}

function makeAuthHeader(userAux, secret = process.env.JWT_SECRET) {
  let user = makeUsersArray()[0];
  user.id=1;
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_code.toString(),
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      products,
      clients,
      promotions,
      promotion_product,
      orders,
      order_promotion,
      order_product,
      daily_sales
      RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  cleanTables,
  makeUsersArray,
  makeProductsArray,
  makeClientsArray,
  makePromotionsArray,
  makePromotionProductArray,
  makeOrdersArray,
  makeOrderProductArray,
  makeOrderPromotionArray,
  makeDailySaleArray,
  makeAuthHeader
};
