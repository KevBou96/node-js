const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth')

router.get('/login', authController.getLogin)

router.post('/login-user', authController.postLogin)

router.post('/logout', authController.logOut)

router.get('/signup', authController.getSignUp)

router.post('/signup-user', authController.postSignUp)

module.exports = router;