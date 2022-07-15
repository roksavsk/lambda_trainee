import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw new Error;
    console.log('Database connection established');
});

const sql = 'CREATE TABLE IF NOT EXISTS storage (id INT AUTO_INCREMENT PRIMARY KEY, url VARCHAR(250), ' +
'data JSON DEFAULT NULL, UNIQUE(url)) ENGINE=InnoDB DEFAULT CHARSET=utf8;';
connection.query(sql, (err) => {
    if (err) throw err;
    console.log('Table created');
});

export default connection;
