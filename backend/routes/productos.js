const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(resultados);
  });
});

router.post('/', (req, res) => {
  const { nombre, tipo_licor, marca, categoria, contenido_ml, precio_compra, precio_venta, stock_actual, stock_minimo } = req.body;

  const sql = 'INSERT INTO productos (nombre, tipo_licor, marca, categoria, contenido_ml, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const valores = [nombre, tipo_licor, marca, categoria, contenido_ml, precio_compra, precio_venta, stock_actual, stock_minimo];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Producto creado', id: resultado.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { nombre, tipo_licor, marca, categoria, contenido_ml, precio_compra, precio_venta, stock_actual, stock_minimo } = req.body;

  const sql = 'UPDATE productos SET nombre=?, tipo_licor=?, marca=?, categoria=?, contenido_ml=?, precio_compra=?, precio_venta=?, stock_actual=?, stock_minimo=? WHERE id_producto=?';
  const valores = [nombre, tipo_licor, marca, categoria, contenido_ml, precio_compra, precio_venta, stock_actual, stock_minimo, req.params.id];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Producto actualizado' });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id_producto = ?', [req.params.id], (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Producto eliminado' });
  });
});

module.exports = router;
