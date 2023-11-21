const express = require('express');
const { check } = require('express-validator')

const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth')

router.get('/login', authController.getLogin)

router.post('/login-user',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email').normalizeEmail(),
    check('password', 'Please enter a password with more than 5 characters and alphanumeric')
        .isLength({min: 5}).isAlphanumeric().trim(),
    authController.postLogin)

router.post('/logout', authController.logOut)

router.get('/signup', authController.getSignUp)

router.post('/signup-user', 
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    check('password', 'Please enter a password with more than 5 characters and alphanumeric')
        .isLength({min: 5}).isAlphanumeric(),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match!')
        }
        return true
    }),
    authController.postSignUp)

router.get('/reset-pass', authController.getResetPassword)

router.post('/reset-pass', authController.postResetPassword)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)


module.exports = router;