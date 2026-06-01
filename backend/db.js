const mysql = require('mysql2');
require('dotenv').config({ path: __dirname + '/.env' });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (process.env.DB_HOST) {
  config.host = process.env.DB_HOST;
  config.port = process.env.DB_PORT || 3306;
} else {
  config.socketPath = '/tmp/mysql.sock';
}

const conexion = mysql.createConnection(config);

conexion.connect((error) => {
  if (error) {
    console.error('Error conectando a la BD:', error.message);
    return;
  }
  console.log('Conectado a MariaDB - licoreria');
});

module.exports = conexion;
