const Product = require('../models/product');
const Cart = require('../models/cart');

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
  let cartProducts = []
  Cart.getCart().then(data => {
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
  const prodId = req.body.productId;
  Cart.AddProductToCart(prodId).then(() => {
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
  const prodId = req.body.product_id;
  console.log(prodId,'sdsda');
  Cart.deleteProductFromCart(prodId).then((data) => {
    res.redirect('/cart')
  }).catch(err => {
    res.status(500).json({
      message: 'parameters are missing',
      error: err
    })
  })
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
