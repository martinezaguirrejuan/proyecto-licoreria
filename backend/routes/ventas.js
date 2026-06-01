const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT v.id_venta, v.fecha_venta, v.total_venta, v.metodo_pago, v.estado,
           v.cedula_cliente, v.cedula_empleado,
           c.nombre AS nombre_cliente,
           e.nombre AS nombre_empleado
    FROM ventas v
    LEFT JOIN clientes c ON v.cedula_cliente = c.cedula
    LEFT JOIN empleados e ON v.cedula_empleado = e.cedula
    ORDER BY v.fecha_venta DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(resultados);
  });
});

router.get('/:id/detalle', (req, res) => {
  const sql = `
    SELECT dv.id_detalle_venta, dv.cantidad, dv.precio_unitario, dv.descuento, dv.subtotal,
           p.nombre AS nombre_producto
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `;
  db.query(sql, [req.params.id], (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(resultados);
  });
});

router.post('/', (req, res) => {
  const { cedula_cliente, cedula_empleado, metodo_pago, estado, total_venta, items } = req.body;

  db.beginTransaction((errTx) => {
    if (errTx) {
      res.status(500).json({ error: errTx.message });
      return;
    }

    const sqlVenta = 'INSERT INTO ventas (cedula_cliente, cedula_empleado, metodo_pago, estado, total_venta) VALUES (?, ?, ?, ?, ?)';
    db.query(sqlVenta, [cedula_cliente, cedula_empleado, metodo_pago, estado, total_venta], (error, resultado) => {
      if (error) {
        return db.rollback(() => res.status(500).json({ error: error.message }));
      }

      const id_venta = resultado.insertId;

      const sqlDetalle = 'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal) VALUES ?';
      const valores = items.map(item => [id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.descuento || 0, item.subtotal]);

      db.query(sqlDetalle, [valores], (error2) => {
        if (error2) {
          return db.rollback(() => res.status(500).json({ error: error2.message }));
        }

        db.commit((errCommit) => {
          if (errCommit) {
            return db.rollback(() => res.status(500).json({ error: errCommit.message }));
          }
          res.json({ mensaje: 'Venta registrada', id_venta });
        });
      });
    });
  });
});

router.put('/:id', (req, res) => {
  const { estado, metodo_pago } = req.body;
  const sql = 'UPDATE ventas SET estado=?, metodo_pago=? WHERE id_venta=?';
  db.query(sql, [estado, metodo_pago, req.params.id], (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Venta actualizada' });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM ventas WHERE id_venta = ?', [req.params.id], (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Venta eliminada' });
  });
});

module.exports = router;
