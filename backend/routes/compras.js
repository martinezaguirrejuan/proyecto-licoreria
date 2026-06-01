const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT c.id_compra, c.fecha_compra, c.total_compra, c.estado,
           c.nit_proveedor, p.nombre_empresa AS nombre_proveedor
    FROM compras c
    JOIN proveedores p ON c.nit_proveedor = p.nit
    ORDER BY c.fecha_compra DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json(resultados);
  });
});

router.get('/:id/detalle', (req, res) => {
  const sql = `
    SELECT dc.id_detalle_compra, dc.cantidad, dc.precio_unitario, dc.subtotal,
           p.nombre AS nombre_producto
    FROM detalle_compras dc
    JOIN productos p ON dc.id_producto = p.id_producto
    WHERE dc.id_compra = ?
  `;
  db.query(sql, [req.params.id], (error, resultados) => {
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json(resultados);
  });
});

router.post('/', (req, res) => {
  const { nit_proveedor, fecha_compra, estado, total_compra, items } = req.body;

  db.beginTransaction((errTx) => {
    if (errTx) { res.status(500).json({ error: errTx.message }); return; }

    const sqlCompra = 'INSERT INTO compras (nit_proveedor, fecha_compra, total_compra, estado) VALUES (?, ?, ?, ?)';
    db.query(sqlCompra, [nit_proveedor, fecha_compra, total_compra, estado], (error, resultado) => {
      if (error) return db.rollback(() => res.status(500).json({ error: error.message }));

      const id_compra = resultado.insertId;

      const sqlDetalle = 'INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES ?';
      const valores = items.map(item => [id_compra, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]);

      db.query(sqlDetalle, [valores], (error2) => {
        if (error2) return db.rollback(() => res.status(500).json({ error: error2.message }));

        const actualizaciones = items.map(item =>
          new Promise((resolve, reject) => {
            db.query('UPDATE productos SET stock_actual = stock_actual + ? WHERE id_producto = ?',
              [item.cantidad, item.id_producto],
              (err) => err ? reject(err) : resolve()
            );
          })
        );

        Promise.all(actualizaciones)
          .then(() => {
            db.commit((errCommit) => {
              if (errCommit) return db.rollback(() => res.status(500).json({ error: errCommit.message }));
              res.json({ mensaje: 'Compra registrada', id_compra });
            });
          })
          .catch((err) => db.rollback(() => res.status(500).json({ error: err.message })));
      });
    });
  });
});

router.put('/:id', (req, res) => {
  const { estado } = req.body;
  const id = req.params.id;

  db.query('SELECT estado FROM compras WHERE id_compra = ?', [id], (error, rows) => {
    if (error) { res.status(500).json({ error: error.message }); return; }

    const estadoAnterior = rows[0].estado;

    db.beginTransaction((errTx) => {
      if (errTx) { res.status(500).json({ error: errTx.message }); return; }

      db.query('UPDATE compras SET estado=? WHERE id_compra=?', [estado, id], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        const debeDdescontarStock = estado === 'Cancelada' && estadoAnterior === 'Completada';
        const debeAgregarStock = estado === 'Completada' && estadoAnterior === 'Pendiente';

        if (!debeDdescontarStock && !debeAgregarStock) {
          return db.commit((errC) => {
            if (errC) return db.rollback(() => res.status(500).json({ error: errC.message }));
            res.json({ mensaje: 'Compra actualizada' });
          });
        }

        db.query('SELECT id_producto, cantidad FROM detalle_compras WHERE id_compra = ?', [id], (err2, items) => {
          if (err2) return db.rollback(() => res.status(500).json({ error: err2.message }));

          const operacion = debeDdescontarStock ? '-' : '+';
          const actualizaciones = items.map(item =>
            new Promise((resolve, reject) => {
              db.query(`UPDATE productos SET stock_actual = stock_actual ${operacion} ? WHERE id_producto = ?`,
                [item.cantidad, item.id_producto],
                (e) => e ? reject(e) : resolve()
              );
            })
          );

          Promise.all(actualizaciones)
            .then(() => db.commit((errC) => {
              if (errC) return db.rollback(() => res.status(500).json({ error: errC.message }));
              res.json({ mensaje: 'Compra actualizada' });
            }))
            .catch((e) => db.rollback(() => res.status(500).json({ error: e.message })));
        });
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM compras WHERE id_compra = ?', [req.params.id], (error) => {
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json({ mensaje: 'Compra eliminada' });
  });
});

module.exports = router;
