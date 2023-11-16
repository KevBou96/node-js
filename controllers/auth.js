const Auth = require('../models/auth')
const bcrypt = require('bcryptjs');

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
            bcrypt.compare(password, result.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user_id = result.user_id
                    return res.redirect('/')
                } 
                res.redirect('/login')
            }).catch(err => {
                console.log(err);
            })
        } else {
            throw "user does not exists"
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'user does not exists',
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
    const hashing = bcrypt.hash(password, 12);
    hashing.then((hashedPassword) => {
        Auth.signUpUser(name, email, hashedPassword).then(() => {
            res.redirect('/login')
        }).catch(err => {
            res.status(500).json({
                message: 'user already exists',
                err: err
            })
        })
    })
    
}

exports.logOut = (req, res , next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    })
}
  