const mysql = require('mysql');
const moment = require('moment'); 
require('dotenv').config()
const con = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASE
});
const createDBConnection = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD
});
const usersTableQuery = `
CREATE TABLE IF NOT EXISTS users(
id INT AUTO_INCREMENT,
balance INT NOT NULL,
firstName VARCHAR(255) NOT NULL,
lastName VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
createdAt TIMESTAMP NOT NULL,
updatedAt TIMESTAMP NOT NULL,
PRIMARY KEY(id),
UNIQUE (id));
`;
const productsTableQuery = `
CREATE TABLE IF NOT EXISTS products(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
category VARCHAR(255) NOT NULL,
brand VARCHAR(255) NOT NULL,
price INT NOT NULL,
createdAt TIMESTAMP NOT NULL,
updatedAt TIMESTAMP NOT NULL,
PRIMARY KEY(id),
UNIQUE (id));
`;
const requestsTableQuery = `
CREATE TABLE IF NOT EXISTS requests(
id INT AUTO_INCREMENT,
productId INT NOT NULL,
userId INT NOT NULL,
status BOOLEAN NOT NULL,
createdAt TIMESTAMP NOT NULL,
updatedAt TIMESTAMP NOT NULL,
PRIMARY KEY(id),
UNIQUE (id),
FOREIGN KEY(userId) REFERENCES users(id),
FOREIGN KEY(productId) REFERENCES products(id)
);`;
const gt100 = Math.floor(Math.random() * 100) + 100
const lt100 = Math.floor(Math.random() * 100)
const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
const insertProductQuery = `
INSERT INTO products(name, brand, category, price, createdAt, updatedAt) 
VALUES
('product-${gt100}','brand','category', ${gt100},'${date}','${date}'),
('product-100','brand','category', 100 ,'${date}','${date}'),
('product-${lt100}','brand','category', ${lt100} ,'${date}','${date}')
;
`
try{
    con.connect()
    console.log("Connected!");
    // con.query(`DROP DATABASE ${process.env.DATABASE};`)
    createDBConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE};`)
    console.log("Database created");
    con.query(usersTableQuery)
    con.query(productsTableQuery)
    con.query(insertProductQuery)
    con.query(requestsTableQuery)
    console.log("Tables Created")
    
    return ;
}catch(e){
    console.log(e)
}


