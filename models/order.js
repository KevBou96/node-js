

const { resolve } = require('bluebird');
const db = require('../util/database');
const Cart = require('../models/cart');

module.exports = class Order {
    static createOrder(totalPrice, user_id) {
        return db.tx(t => {
            const createOrderQuery = t.one('INSERT INTO orders (user_id, total) VALUES($2, $1) RETURNING order_id', [totalPrice, user_id]);
            const getProductIds = t.any('SELECT p.product_id, c.qty FROM products p INNER JOIN cart c ON c.product_id = p.product_id WHERE c.user_id = $1 ORDER BY c.cart_id', user_id);
            const deleteCart = Cart.emptyCart(user_id);
            return t.batch([createOrderQuery, getProductIds, deleteCart]);
        }).then((res) => {
            let orderId = res[0].order_id;
            let pIds = [];
            let pQty = []
            res[1].map((ele) =>{
                pIds.push(ele.product_id);
                pQty.push(ele.qty)
            })
            return db.any('INSERT INTO order_items(order_id, product_id, qty) SELECT $1, UNNEST(ARRAY[$2:csv]), UNNEST(ARRAY[$3:csv])', [orderId, [pIds], [pQty]]);
        })
      }

      static getOrders(user_id) {
        return db.any('SELECT i.order_id, i.product_id, i.qty, o.total FROM order_items i INNER JOIN orders o ON i.order_id = o.order_id WHERE o.user_id = $1', user_id);
        // return db.any('SELECT order_id FROM orders WHERE user_id = 1')
      }
}