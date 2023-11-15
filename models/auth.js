
const db = require('../util/database');

module.exports = class Auth {
    
    static loginUser(name, email, password) {
      return db.any('SELECT user_id FROM users WHERE email = $1 ', email)
    }

    static signUpUser(name, email, password) {
      return db.any('INSERT INTO users(name, email, password) VALUES($1, $2, $3) ON CONFLICT DO NOTHING', [name, email, password])
    }
  }