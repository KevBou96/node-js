const Auth = require('../models/auth')

exports.getLogin = (req, res, next) => {
    const sessionVal = req.session.user_id;
    console.log(sessionVal);
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
        if(result) {
            req.session.isLoggedIn = true;
            req.session.user_id = result[0].user_id
            res.redirect('/')
        } else {
            throw(err)
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'could not add user to database',
            err: err
            
        })
    })
}
  