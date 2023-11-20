
const { errors } = require('pg-promise');
const db = require('../util/database');
const nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'kevbousader@gmail.com',
    pass: 'nhwk jttq kbwn cpzj'
  }
})



module.exports = class Auth {
    
    static loginUser(email, password) {
      return db.oneOrNone('SELECT user_id, password FROM users WHERE email = $1', email)
    }

    static signUpUser(name, email, hashedPassword) {
        return db.none('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword])
    }

    static sendMailCreatedAccountMail(email) {  
      return transport.sendMail({
        from: 'kevbousader@gmail.com',
        to: email,
        subject: 'info',
        text: 'You have created your account successfully'
      })
    }

    static sendResetPasswordMail(user) {
      return transport.sendMail({
        from: 'kevbousader@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        html: `
          <p>You requested a password rest</p>
          <p>Click this <a href="http://localhost:3000/new-password/${user.resettoken}">link</a> to set a new password</p>
        `
      })
    }

    static getUserId(email) {
      return db.oneOrNone('SELECT * FROM users WHERE email = $1', email);
    }

    static updateUserResetPassword(user) {
      return db.none('UPDATE users SET resettoken = $1, resettokenexpiration = $2 WHERE email = $3',
      [user.resettoken, user.resettokenexpiration, user.email]);
    }

    static getResetPasswordUser(token) {
      return db.oneOrNone('SELECT * FROM users WHERE resettoken = $1', token)
    }

    static updateNewPassword(email, newPassword) {
        return db.none('UPDATE users SET password = $1, resettoken = null, resettokenexpiration = null WHERE email = $2',
        [newPassword, email])
    }
}