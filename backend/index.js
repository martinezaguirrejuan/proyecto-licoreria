const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

app.use(cors());
app.use(express.json());

const db = require('./db');
const productosRoutes = require('./routes/productos');

app.use('/productos', productosRoutes);

const clientesRoutes = require('./routes/clientes');
  app.use('/clientes', clientesRoutes);    

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Licorería funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
