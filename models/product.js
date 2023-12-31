const fs = require('fs');
const path = require('path');

const db = require('../util/database');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

module.exports = class Product {
  constructor(id, title, imageurl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageurl;
    this.description = description;
    this.price = price;
  }

  saveProduct() {
      return db.none(`INSERT INTO products(title, imgurl, price, description) VALUES($1, $2, $3, $4)`, [this.title, this.imageUrl, this.price, this.description])
  }

  updateProduct() {
    if (this.imageUrl) {
      return db.none('UPDATE products SET title = $1, imgurl = $2, price = $3, description = $4 WHERE product_id = $5', [this.title, this.imageUrl, this.price, this.description, this.id])
    } else {
      return db.none('UPDATE products SET title = $1, price = $2, description = $3 WHERE product_id = $4', [this.title, this.price, this.description, this.id])
    }
    
  }

  static deleteById(id) {
    return db.none(`DELETE FROM products WHERE product_id = $1`, id);
  }

  static findById(id) {
    return db.one(`select * from products where product_id = $1`, id);
  }

  static getProducts() {
    return db.any('select * from products order by product_id');
  }

  static getProductsLimit(offset) {
    return db.any('select * from products order by product_id limit 4 offset $1', offset);
  }

  static getProductsCount() {
    return db.oneOrNone('SELECT count(*) FROM products')
  }
};

