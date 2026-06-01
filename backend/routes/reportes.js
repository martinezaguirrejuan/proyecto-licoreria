const express = require('express');
const router = express.Router();
const db = require('../db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows))
  );

// Ventas totales por día — últimos 7 días
router.get('/ventas-por-dia', async (req, res) => {
  try {
    const rows = await query(`
      SELECT DATE(fecha_venta) AS dia, COALESCE(SUM(total_venta), 0) AS total, COUNT(*) AS cantidad
      FROM ventas
      WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND estado = 'Completada'
      GROUP BY DATE(fecha_venta)
      ORDER BY dia ASC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// TOP 5 productos más vendidos (por unidades)
router.get('/productos-mas-vendidos', async (req, res) => {
  try {
    const rows = await query(`
      SELECT p.nombre, SUM(dv.cantidad) AS unidades, SUM(dv.subtotal) AS total
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE v.estado = 'Completada'
      GROUP BY p.id_producto, p.nombre
      ORDER BY unidades DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Ventas por método de pago
router.get('/ventas-por-metodo', async (req, res) => {
  try {
    const rows = await query(`
      SELECT metodo_pago, COUNT(*) AS cantidad, SUM(total_venta) AS total
      FROM ventas
      WHERE estado = 'Completada'
      GROUP BY metodo_pago
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Ventas vs Compras por mes — últimos 6 meses
router.get('/ingresos-vs-costos', async (req, res) => {
  try {
    const ventas = await query(`
      SELECT DATE_FORMAT(fecha_venta, '%Y-%m') AS mes, SUM(total_venta) AS total_ventas
      FROM ventas
      WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
        AND estado = 'Completada'
      GROUP BY mes
      ORDER BY mes ASC
    `);
    const compras = await query(`
      SELECT DATE_FORMAT(fecha_compra, '%Y-%m') AS mes, SUM(total_compra) AS total_compras
      FROM compras
      WHERE fecha_compra >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
        AND estado = 'Completada'
      GROUP BY mes
      ORDER BY mes ASC
    `);

    // Unir ambos en un solo array por mes
    const meses = [...new Set([...ventas.map(v => v.mes), ...compras.map(c => c.mes)])].sort();
    const resultado = meses.map(mes => ({
      mes,
      ventas: Number(ventas.find(v => v.mes === mes)?.total_ventas || 0),
      compras: Number(compras.find(c => c.mes === mes)?.total_compras || 0),
    }));

    res.json(resultado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
