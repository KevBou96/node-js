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
    return db.one('UPDATE products SET incart = false, qty = 0 WHERE user_id =$1 RETURNING *', id)
  }

  static getCart(cb) {
    return db.any('SELECT * FROM products WHERE incart = true ORDER BY qty');
  }

   static AddProductToCart(id) {
    return db.none('UPDATE products SET incart = true, qty = qty + 1 WHERE user_id = $1', id);
  }
};
