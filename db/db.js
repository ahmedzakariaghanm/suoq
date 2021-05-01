const mysql = require('mysql');
const util = require('util')
const Promise = require('bluebird');

require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASE
})
const connection = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASE
});
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})
pool.query = util.promisify(pool.query)
exports.pool = pool;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
exports.connection = connection;

