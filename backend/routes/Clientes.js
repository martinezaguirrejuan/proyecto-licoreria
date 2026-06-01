const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(resultados);
  });
});

router.post('/', (req, res) => {
  const { cedula, nombre, telefono, email, direccion } = req.body;

  const sql = 'INSERT INTO clientes (cedula, nombre, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)';
  const valores = [cedula, nombre, telefono, email, direccion];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Cliente creado' });
  });
});

router.put('/:cedula', (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;

  const sql = 'UPDATE clientes SET nombre=?, telefono=?, email=?, direccion=? WHERE cedula=?';
  const valores = [nombre, telefono, email, direccion, req.params.cedula];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Cliente actualizado' });
  });
});

router.delete('/:cedula', (req, res) => {
  db.query('DELETE FROM clientes WHERE cedula = ?', [req.params.cedula], (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Cliente eliminado' });
  });
});

module.exports = router;
