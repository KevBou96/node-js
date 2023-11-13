const Auth = require('../models/auth')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login'
    });
  };

exports.postLogin = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password
    Auth.loginUser(name, email, password)
    .then(result => {
        if( result) {
            res.setHeader('Set-Cookie', 'user_id=result.user_id')
            res.redirect('/')
        } else {
            throw(err)
        }
    }).catch(err => {
        res.status(500).json({
            message: 'could not add user to database',
            err: err
        })
    })
}
  