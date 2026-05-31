const mysql = require('mysql2');
require('dotenv').config({ path: __dirname + '/.env' });

const conexion = mysql.createConnection({
  socketPath: '/tmp/mysql.sock',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

conexion.connect((error) => {
  if (error) {
    console.error('Error conectando a la BD:', error.message);
    return;
  }
  console.log('Conectado a MariaDB - licoreria');
});

module.exports = conexion;
