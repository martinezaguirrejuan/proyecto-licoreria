const express = require('express');
const router = express.Router();
const db = require('../db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows))
  );

router.get('/', async (req, res) => {
  try {
    const [ventasHoy] = await query(
      "SELECT COUNT(*) AS cantidad, COALESCE(SUM(total_venta), 0) AS total FROM ventas WHERE DATE(fecha_venta) = CURDATE() AND estado = 'Completada'"
    );
    const [ventasMes] = await query(
      "SELECT COUNT(*) AS cantidad, COALESCE(SUM(total_venta), 0) AS total FROM ventas WHERE MONTH(fecha_venta) = MONTH(NOW()) AND YEAR(fecha_venta) = YEAR(NOW()) AND estado = 'Completada'"
    );
    const [totalClientes] = await query('SELECT COUNT(*) AS total FROM clientes');
    const [totalProductos] = await query('SELECT COUNT(*) AS total FROM productos');

    const stockBajo = await query(
      'SELECT id_producto, nombre, stock_actual, stock_minimo FROM productos WHERE stock_actual <= stock_minimo ORDER BY stock_actual ASC'
    );

    const ultimasVentas = await query(
      `SELECT v.id_venta, v.fecha_venta, v.total_venta, v.metodo_pago, v.estado,
              c.nombre AS nombre_cliente
       FROM ventas v
       LEFT JOIN clientes c ON v.cedula_cliente = c.cedula
       ORDER BY v.fecha_venta DESC LIMIT 5`
    );

    res.json({
      ventasHoy,
      ventasMes,
      totalClientes: totalClientes.total,
      totalProductos: totalProductos.total,
      stockBajo,
      ultimasVentas
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
