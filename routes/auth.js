const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth')

router.get('/login', authController.getLogin)

router.post('/login-user', authController.postLogin)

router.post('/logout', authController.logOut)

router.get('/signup', authController.getSignUp)

router.post('/signup-user', authController.postSignUp)

router.get('/reset-pass', authController.getResetPassword)

router.post('/reset-pass', authController.postResetPassword)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)


module.exports = router;