const path = require('path');

var promise = require('bluebird')

var options = {
    promiseLib: promise
}

const pgp = require('pg-promise')(options);
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '../', 'development.env')
});

const connection = 'postgres://postgres:Kevene96*@localhost:5432/nodedb'
const db = pgp(connection)


module.exports = db;

