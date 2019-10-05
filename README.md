# Liquor Store Server (API)

This app should be used by any liquor store to sell different kinds of liquor, get reports about every sell and day. Also, we can get the maintenance of products, clients, and users.

## Demo

Click on the next link: [Demo](https://serene-eyrie-30268.herokuapp.com/api)

## File .env

>NODE_ENV=development  
PORT=8000  
DB_URL="postgresql://user@localhost/liquor-store"  
TEST_DB_URL="postgresql://user@localhost/liquor-store-test"  
JWT_SECRET="84b6fg1c-34f7-49v7-9414-58dca813c3c5"  
JWT_EXPIRY="3m"  
MAIL_USER="user@gmail.com"</br>
MAIL_PASS="password"  
TAX_PERCENT="0.0925"  

## Database schema

![App Image](/images/1.png)


## Liquor Store API
- [Main Url](#main-url)
- [Users](#users)
- [Products](#meta)
- [API overview](#api-overview)


## Main URL  
`https://serene-eyrie-30268.herokuapp.com/api`

## Users

Create, edit and delete users allowed to use the app.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| publisher | String | Yes | Name of work's publisher |
| title | Array of String | Yes | Work titles, including translated titles |
| original-title | Array of String | No | Work titles in the work's original publication language |
| short-title | Array of String | No | Short or abbreviated work titles |


| Resource | Method | Description |
|-------|------|----------|
| /users | GET | Return all active users |
|    ^   | POST | Store a new user |
| /users/:user_id | GET | Return user with user_id |
|                 | PATCH | Edit user with user_id |
|                 | DELETE | Inactive user with user_id |
| /type/:type | GET | Return users roles |
| /getbyrol/:role | GET | Return users by some role |
