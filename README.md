# Liquor Store Server (API)

This app should be used by any liquor store to sell different kinds of liquor, get reports about every sell and day. Also, we can get the maintenance of products, clients, and users.

- [Demo](#demo)
- [File .env](#file-.env)
- [Technologies](#technologies)
- [Database schema](#database-schema)
- [Main Url](#main-url)
- [Users](#users)
- [Products](#products)
- [Clients](#clients)
- [Promotions](#promotions)
- [Promotion Product](#promotion-product)
- [Orders](#orders)
- [Order Product](#order-product)
- [Order Promotion](#order-promotion)


## Demo

Click on the next link: [Demo](https://serene-eyrie-30268.herokuapp.com/api)

## File .env

>NODE_ENV=development  
PORT=8000  
DB_URL="postgresql://user@localhost/liquor-store"  
TEST_DB_URL="postgresql://user@localhost/liquor-store-test"  
JWT_SECRET="84b6fg1c-34f7-49v7-9414-58dca813c3c5"  
JWT_EXPIRY="3m"   
SENDGRID_USERNAME="user@heroku.com"</br>  
TAX_PERCENT=0.0925  
AWS_BUCKET_NAME=example-storage  
AWS_ACCESS_KEY_ID=Your-api-id-here  
AWS_SECRET_ACCESS_KEY=Your-secret-here  
AWS_REGION=us-east-1  
SENDGRID_API_KEY=Your-api-here

## Technologies

>NodeJS  
Express  
Postgresql  
AWS S3  
SendGrid


## Database schema

![App Image](/images/1.png)


## Main URL  
`https://serene-eyrie-30268.herokuapp.com/api`

## Users

Create, edit and delete users allowed to use the app.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | User id generated automatically |
| user_code | Integer | No | User code generated automatically |
| first_name | String | Yes | User first name |
| last_name | String | Yes | User last name |
| address | String | No | User address |
| phone | String | No | User phone number |
| email | String | No | User email address |
| role | String | Yes | User role, default 'ADMIN' |
| password | String | Yes | User password |
| status | String | Yes | User status, default 'Active' |
| date_created | Timestamp | Yes | User date creation, the first time will put the current date automatically |


| Resource | Method | Description |
|-------|------|----------|
| /users | GET | Return all active users |
|        | POST | Store a new user |
| /users/:user_id | GET | Return user with user_id |
|                 | PATCH | Edit user with user_id |
|                 | DELETE | Inactive user with user_id |
| /type/:type | GET | Return users roles |
| /getbyrol/:role | GET | Return users by some role |

## Products

Create, edit and delete products to sell.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Product id generated automatically |
| name | String | Yes | Product name |
| picture | String | Yes | Product picture name saved automatically |
| description | String | No | Product description |
| stock | Integer | Yes | Product stock |
| price | Decimal | Yes | Product price |
| status | String | Yes | Product status, default 'Active' |
| date_created | Timestamp | Yes | Product date creation, the first time will put the current date automatically |


| Resource | Method | Description |
|-------|------|----------|
| /products | GET | Return all active products |
|        | POST | Store a new product |
| /products/:product_id | GET | Return product with product_id |
|                 | PATCH | Edit product with product_id |
|                 | DELETE | Inactive product with product_id |


## Clients

Create, edit and delete client who buy products.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Client id generated automatically |
| full_name | String | Yes | Client first and last name |
| address | String | No | Client address |
| phone | String | No | Client phone number |
| email | String | No | Client email address |
| status | String | Yes | Client status, default 'Active' |
| date_created | Timestamp | Yes | Client date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /clients | GET | Return all active clients |
|        | POST | Store a new client |
| /clients/:client_id | GET | Return client with client_id |
|                 | PATCH | Edit client with client_id |
|                 | DELETE | Inactive client with client_id |

## Promotions

Create, edit and delete promotions (combos) to sell.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Promotion id generated automatically |
| name | String | Yes | Promotion name |
| picture | String | Yes | Promotion picture name saved automatically |
| description | String | No | Promotion description |
| stock | Integer | Yes | Promotion stock |
| price | Decimal | Yes | Promotion price |
| status | String | Yes | Promotion status, default 'Active' |
| date_created | Timestamp | Yes | Promotion date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /promotions | GET | Return all active promotions |
|        | POST | Store a new promotion |
| /promotions/:promotion_id | GET | Return promotion with promotion_id |
|                 | PATCH | Edit promotion with promotion_id |
|                 | DELETE | Inactive promotion with promotion_id |

## Promotion Product

Create, edit and delete product in a promotion.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Relation promotion-product id generated automatically |
| promotion_id | Integer | Yes | Promotion id |
| product_id | Integer | Yes | Product id |
| quantity | Integer | Yes | Quantity of that product in the promotion |
| date_created | Timestamp | Yes | Relation promotion-product date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /promotions/:promotion_id/products | GET | Return all active products in one promotion with promotion_id |
|        | POST | Store a new product in one promotion with promotion_id |
| /promotions/:promotion_id/products/:product_id | GET | Return a product with product_id contained in a promotion with promotion_id |
|                 | PATCH | Edit product with product_id contained in a promotion with promotion_id |
|                 | DELETE | Delete product with product_id contained in a promotion with promotion_id |

## Orders

Create, edit and delete orders with products bought by the client.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Order id generated automatically |
| user_id | Integer | Yes | User id who is creating the order |
| client_id | Integer | Yes | Client id who is buying products |
| subtotal | Decimal | Yes | Order subtotal that is sum of all products |
| tax | Decimal | Yes | Order tax generated automatically according subtotal |
| total | Decimal | Yes | Order total generated automatically according subtotal and tax |
| observation | String | No | Order observation if it is necessary |
| status | String | Yes | Order status, default 'Active' |
| date_created | Timestamp | Yes | Order date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /orders | GET | Return all active orders |
|        | POST | Store a new order |
| /orders/:order_id | GET | Return order with order_id |
|                 | PATCH | Edit order with order_id |
|                 | DELETE | Inactive order with order_id |

## Order Product

Create, edit and delete product in a order

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Relation order-product id generated automatically |
| order_id | Integer | Yes | Order id |
| product_id | Integer | Yes | Product id |
| quantity | Integer | Yes | Quantity of that products in the order |
| price | Decimal | Yes | Product price in the order |
| observation | String | No | Relation order-product observation if it is necessary |
| date_created | Timestamp | Yes | Relation order-product date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /orders/:order_id/products | GET | Return all active products in one order with order_id |
|        | POST | Store a new product in one order with order_id |
| /orders/:order_id/products/:product_id | GET | Return a product with product_id contained in a order with order_id |
|                 | PATCH | Edit product with product_id contained in a order with order_id |
|                 | DELETE | Delete product with product_id contained in a order with order_id |

## Order Promotion

Create, edit and delete promotion in a order

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | No | Relation order-promotion id generated automatically |
| order_id | Integer | Yes | Order id |
| promotion_id | Integer | Yes | Promotion id |
| quantity | Integer | Yes | Quantity of that promotions in the order |
| price | Decimal | Yes | Promotion price in the order |
| observation | String | No | Relation order-promotion observation if it is necessary |
| date_created | Timestamp | Yes | Relation order-promotion date creation, the first time will put the current date automatically |

| Resource | Method | Description |
|-------|------|----------|
| /orders/:order_id/promotions | GET | Return all active promotions in one order with order_id |
|        | POST | Store a new promotion in one order with order_id |
| /orders/:order_id/promotions/:promotion_id | GET | Return a promotion with promotion_id contained in a order with order_id |
|                 | PATCH | Edit promotion with promotion_id contained in a order with order_id |
|                 | DELETE | Delete promotion with promotion_id contained in a order with order_id |
