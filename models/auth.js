
const { errors } = require('pg-promise');
const db = require('../util/database');

module.exports = class Auth {
    
    static loginUser(name, email, password) {
      return db.oneOrNone('SELECT user_id, password FROM users WHERE email = $1', email)
    }

    static signUpUser(name, email, hashedPassword) {
        return db.none('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', [name, email, hashedPassword])
    }
}