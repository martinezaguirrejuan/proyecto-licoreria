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



  const authRoutes = require('./routes/auth');                                  
  app.use('/auth', authRoutes);    
  
 const proveedoresRoutes = require('./routes/proveedores');
  app.use('/proveedores', proveedoresRoutes);   

 const empleadosRoutes = require('./routes/empleados');
  app.use('/empleados', empleadosRoutes);

const ventasRoutes = require('./routes/ventas');
app.use('/ventas', ventasRoutes);

const comprasRoutes = require('./routes/compras');
app.use('/compras', comprasRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes);

const reportesRoutes = require('./routes/reportes');
app.use('/reportes', reportesRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Licorería funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
