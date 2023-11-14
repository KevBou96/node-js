const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.getProducts().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.getProducts().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  let totalPrice = 0;
  let cartProducts = [];
  let user_id = req.session.user_id
  Cart.getCart(user_id).then(data => {
    cartProducts = [...data];
    cartProducts.forEach(element => {
      totalPrice +=  element.price*element.qty
    });
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts,
      tPrice: totalPrice
    })
  }).catch(err => {
    console.log(err);
  })  
}

exports.postCart = (req, res, next) => {
  const product_id = req.body.productId;
  const user_id = req.session.user_id;
  Cart.AddProductToCart(product_id, user_id).then((data) => {
    res.redirect('/cart');
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'parameters are missing',
      error: err
    })
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const product_id = req.body.product_id;
  const user_id = req.session.user_id;
  Cart.deleteProductFromCart(product_id, user_id).then((data) => {
    res.redirect('/cart')
  }).catch(err => {
    res.status(500).json({
      message: 'parameters are missing',
      error: err
    })
  })
};

exports.emptyCart = (req, res, next) => {
  const user_id = req.session.user_id;
  Cart.emptyCart(user_id).then(() => {
    res.redirect('/orders')
  }).catch(err => {
    res.status(500).json({
      message: 'error',
      error: err
    })
  })
}

exports.createOrder = (req, res, next) => {
  let totalPrice = req.body.total_price;
  const user_id = req.session.user_id;
  Order.createOrder(totalPrice, user_id).then((data) => {
    res.redirect('/orders')
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'error',
      error: err
    })
  })
} 

exports.getOrders = (req, res, next) => {
  const user_id = req.session.user_id;
  Order.getOrders(user_id).then(data => {
    console.log(data);
    // res.render('shop/orders', {
    //   path: '/orders',
    //   pageTitle: 'Your Orders'
    // });
    res.status(200).json({
      message: 'success',
      response: data
    })
  }).catch(err => {
    res.status(500).json({
      message: 'error',
      error: err
    })
  });
  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
