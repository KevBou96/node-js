const fs = require('fs');
const path = require('path');
const db = require('../util/database')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);



module.exports = class Cart {

  static deleteProductFromCart(id) {
    console.log(id);
    return db.none('DELETE FROM cart WHERE product_id = $1', id)
  }

  static getCart(cb) {
    return db.any('SELECT p.product_id, title, imgurl, price, description, c.qty FROM products p INNER JOIN cart c ON c.product_id = p.product_id ORDER BY qty');
  }

  static AddProductToCart(id) {
    return db.none('INSERT INTO cart (product_id, qty) VALUES($1, 1) ON CONFLICT(product_id) DO UPDATE SET qty = 2', id);
  }
};
