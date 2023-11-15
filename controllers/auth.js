const Auth = require('../models/auth')

exports.getLogin = (req, res, next) => {
    const sessionVal = req.session;
    console.log(sessionVal.isLoggedIn);
    console.log(sessionVal.user_id);
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

exports.getSignUp = (req, res, next) => {
        res.render('auth/signup', {
            pageTitle: 'Sign Up',
            path: '/signup'
        })
}

exports.postSignUp = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    Auth.signUpUser(name, email, password).then((result) => {
        console.log(result);
        res.redirect('/login')
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'could not add user to database',
            err: err
            
        })
    })
}

exports.logOut = (req, res , next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    })
}
  