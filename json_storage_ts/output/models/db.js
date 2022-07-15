"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
connection.connect((err) => {
    if (err)
        throw new Error;
    console.log('Database connection established');
});
const sql = 'CREATE TABLE IF NOT EXISTS storage (id INT AUTO_INCREMENT PRIMARY KEY, url VARCHAR(250), ' +
    'data JSON DEFAULT NULL, UNIQUE(url)) ENGINE=InnoDB DEFAULT CHARSET=utf8;';
connection.query(sql, (err) => {
    if (err)
        throw err;
    console.log('Table created');
});
exports.default = connection;
