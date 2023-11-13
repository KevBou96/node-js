
const db = require('../util/database');

module.exports = class Auth {
    
    static loginUser(name, email, password) {
        return db.one('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING user_id', [name, email, password]) 
    }
}