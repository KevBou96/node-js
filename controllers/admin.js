const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: null
  });
};

exports.postAddProduct = (req, res, next) => {
  const id = req.params.productId
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price
  const description = req.body.description;
  if (!image) {
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: 'file is not an image'
    });
  }
  const imageUrl = image.path;
  const product = new Product(null, title, imageUrl, description, price);
  product.saveProduct().then(() => {
    // res.status(200).location('/').json({message: 'product saved in databse'})
    res.redirect('/')
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      errorMessage: null
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.product_id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    id = prodId,
    title = updatedTitle,
    imageurl = image ? image.path : null,
    description = updatedDesc,
    price = updatedPrice
  );
  console.log(image);
  updatedProduct.updateProduct().then(data => {
    res.redirect('/admin/products');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  })
};

exports.getProducts = (req, res, next) => {
  Product.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.product_id;
  Product.deleteById(prodId).then(() => {
    res.redirect('/admin/products');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error)
  })
};
