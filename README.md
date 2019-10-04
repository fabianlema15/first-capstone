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

## Functionalities

1. There are 3 roles: admin, manager, and seller.
2. As the admin should able to access all functionalities of the app.
3. The manager can see and manage(CRUD) a list of all products, clients, sales, and sellers.
4. Admin can create new accounts with any role.
5. Managers can create promotions(combos) that can have many products and the quantity of each one.
6. As the manager could daily report of all employees, manage products and its stocks, also manages one new sale. Get reports of sales and products.
7. Manage can get reports of sales by any seller.
8. Users should access the app using code with 6 numbers.
9. The client should have basic information to be contacted if is necessary.
10. Each sale can add new products and manage quantity. The total by each product and all products should be calculated automatically.
11. The product of each product inside of promotions should be updated automatically after the new sale.
12. Each product should behave at least information on stock, price, and picture.
13. Reports should be sended by email.
8. The app should be focused on use in phone or tablet device.

## Images

1. Database schema

![App Image](/images/1.png)


<!-- TOC depthFrom:1 depthTo:2 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Crossref REST API](#crossref-rest-api)
    - [Preamble](#preamble)
    - [Meta](#meta)
    - [API overview](#api-overview)
    - [Result types](#result-types)
    - [Resource components](#resource-components)
    - [Parameters](#parameters)
    - [Queries](#queries)
    - [Field Queries](#field-queries)
    - [Sorting](#sorting)
    - [Facet counts](#facet-counts)
    - [Filter names](#filter-names)
    - [Result controls](#result-controls)
    - [API versioning](#api-versioning)
    - [Documentation history](#documentation-history)

<!-- /TOC -->


# Liquor Store API

## Preamblr

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.

## Preamblr

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.
## Preamblr

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.
## Preamblr

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.
## Preamblr

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.

## Preamble

The Crossref REST API is one of [a variety of tools and APIs](https://www.crossref.org/services/metadata-delivery/) that allow anybody to search and reuse our members' metadata in sophisticated ways.
