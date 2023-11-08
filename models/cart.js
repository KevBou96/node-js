const fs = require('fs');
const path = require('path');
const db = require('../util/database');
const { log } = require('console');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);



module.exports = class Cart {

  static deleteProductFromCart(id) {
    return db.none('DELETE FROM cart WHERE product_id = $1 AND user_id = 1', id)
  }

  static getCart() {
    return db.any('SELECT p.product_id, title, imgurl, price, description, c.qty FROM products p INNER JOIN cart c ON c.product_id = p.product_id WHERE c.user_id = 1 ORDER BY qty');
  }

  static AddProductToCart(id) {
    const promise = db.any('SELECT product_id FROM cart WHERE product_id = $1 AND user_id = 1', id).then(res => {
      if (res.length > 0) {
        return db.none('UPDATE cart SET qty = qty + 1 WHERE product_id = $1 AND user_id = 1', id)
      } else {
        return db.none('INSERT INTO cart (user_id, product_id, qty) VALUES(1, $1, 1)', id)
      }
    }).catch(err => {
      console.log(err);
    }) 
    return Promise.all([promise])
  }

  static emptyCart() {
    return db.none('DELETE FROM cart WHERE user_id = 1');
  }
};
