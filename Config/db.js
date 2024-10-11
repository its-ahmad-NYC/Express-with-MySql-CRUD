const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,      // DB host, e.g., 'localhost'
    user: process.env.USER,      // DB user, e.g., 'root'
    password: process.env.PASSWORD || '',  // DB password, empty if not set
    database: process.env.DATABASE,   // DB name
    port: process.env.DB_PORT || 3306 // MySQL port (3306 by default)
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;
