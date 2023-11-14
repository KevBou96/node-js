
const db = require('../util/database');

module.exports = class Auth {
    
    static loginUser(name, email, password) {
        const promise = db.any('SELECT user_id FROM users WHERE email = $1 ', email).then(res => {
            if (res.length > 0) {
                return res[0]
            } else {
              return db.one('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING user_id', [name, email, password])
            }
          }).catch(err => {
            console.log(err);
          }) 
          return Promise.all([promise])
    }
}