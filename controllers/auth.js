const Auth = require('../models/auth')
const bcrypt = require('bcryptjs');
const { log } = require('console');
const crypto = require('crypto');

exports.getLogin = (req, res, next) => {
    const sessionVal = req.session;
    console.log(sessionVal.isLoggedIn, 'logged?');
    console.log(sessionVal.user_id, 'user id');
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: req.flash('error')
    });
  };

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    Auth.loginUser(email, password)
    .then(result => {
        if(result) {
            bcrypt.compare(password, result.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user_id = result.user_id
                    return res.redirect('/')
                } 
                req.flash('error', 'Wrong Password')
                res.redirect('/login')
            }).catch(err => {
                console.log(err);
            })
        } else {
            req.flash('error', 'Invalid email')
            res.redirect('/login')
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
            Auth.sendMailCreatedAccountMail(email).then((res) => {
                console.log('email sent');
            }).catch(err => {
                res.status(500).json({
                    message: 'email could not send',
                    err: err
                })
            })
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

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Pass',
        path: '/reset',
        errorMessage: req.flash('error')
    })
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', err)
            return res.redirect('/reset-pass');
        }
        const token = buffer.toString('hex');
        Auth.getUserId(email).then(user => {
            if (!user) {
                req.flash('error', 'No user exists with that email');
                return res.redirect('/reset-pass')
            }
            user.resettoken = token;
            user.resettokenexpiration = Date.now() + 3600000;
            console.log(user);
            Auth.updateUserResetPassword(user).then(() => {
                Auth.sendResetPasswordMail(user).then(() => {
                    req.flash('error', 'email has been sent');
                    res.redirect('/login');
                }).catch(err => {
                    res.status(500).json({
                        message: 'an error has occurrec',
                        error: err
                    })
                })
            }).catch(err => {
                res.status(500).json({
                    message: 'an error has occurrec',
                    error: err
                })
            })
        }).catch(err => {
            res.status(500).json({
                message: 'an error has occurrec',
                error: err
            })
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    Auth.getResetPasswordUser(token).then((user) => {
        if (!user) {
            return res.status(401).send('user not found')
        }
        if (user.resettokenexpiration < Date.now()) {
            return res.status(500).send('token has expired')
        }
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            token: user.resettoken
        })
        
    }).catch(err => {
        res.status(500).json({
            message: 'an error has occurrec',
            error: err
        })
    })
}

exports.postNewPassword = (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;
    Auth.getResetPasswordUser(token).then(user => {
        if (!user) {
            return res.status(401).send('token not found')
        }
        if (user.resettokenexpiration < Date.now()) {
            return res.status(500).send('token has expired')
        }
        const hashing = bcrypt.hash(newPassword, 12)
        hashing.then((hashedPassword) => {
            Auth.updateNewPassword(user.email, hashedPassword).then(() => {
                req.flash('error', 'Password has been updated');
                res.redirect('/login');
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });  
}