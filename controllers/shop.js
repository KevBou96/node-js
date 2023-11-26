const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const PDFdoc = require('pdfkit');
const path = require('path');
const fs = require('fs')

exports.getProducts = (req, res, next) => {
  Product.getProducts().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
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
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
};

exports.getIndex = (req, res, next) => {
  Product.getProducts().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
}

exports.postCart = (req, res, next) => {
  const product_id = req.body.productId;
  const user_id = req.session.user_id;
  Cart.AddProductToCart(product_id, user_id).then((data) => {
    res.redirect('/cart');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const product_id = req.body.product_id;
  const user_id = req.session.user_id;
  Cart.deleteProductFromCart(product_id, user_id).then((data) => {
    res.redirect('/cart')
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
};

exports.emptyCart = (req, res, next) => {
  const user_id = req.session.user_id;
  Cart.emptyCart(user_id).then(() => {
    res.redirect('/orders')
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
}

exports.createOrder = (req, res, next) => {
  let totalPrice = req.body.total_price;
  const user_id = req.session.user_id;
  Order.createOrder(totalPrice, user_id).then((data) => {
    res.redirect('/orders')
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
} 

exports.getOrders = (req, res, next) => {
  const user_id = req.session.user_id;
  Order.getOrders(user_id).then(data => {
    return res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: data
    });
    
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getInvoice = (req, res, next) => {
   const orderId = req.params.orderId;
   const user_id = req.session.user_id;
   Order.verifyOrderData(user_id, orderId)
   .then((invoiceData) => {
    if (invoiceData.length == 0) {
      const error = new Error('No order found');
      error.httpStatusCode = 404;
      return next(error);
    }
    Order.getOrderData(orderId)
    .then((orderData) => {
      if (orderData.length == 0) {
        const error = new Error('No order found');
        error.httpStatusCode = 404;
        return next(error);
      }
      generatePdf(orderId, orderData, invoiceData[0], res);
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
   }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
}

function generatePdf(order_id, order_data, invoice_data, res) {
    const totalPrice = invoice_data.total;
    const invoiceName = 'invoice-' + order_id + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const pdfDoc = new PDFdoc();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('-------------------------------------------------');
    order_data.forEach(product => {
      pdfDoc.fontSize(14).text(product.title + ' - ' + product.qty + 'x' + '$' + product.price)
    })
    pdfDoc.fontSize(20).text('Total price: $' + totalPrice, {
      underline: true
    });
    pdfDoc.end();
}