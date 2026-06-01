const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM proveedores', (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(resultados);
  });
});

router.post('/', (req, res) => {
  const { nit, nombre_empresa, telefono, email, persona_contacto } = req.body;

  const sql = 'INSERT INTO proveedores (nit, nombre_empresa, telefono, email, persona_contacto) VALUES (?, ?, ?, ?, ?)';
  const valores = [nit, nombre_empresa, telefono, email, persona_contacto];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Proveedor creado' });
  });
});

router.put('/:nit', (req, res) => {
  const { nombre_empresa, telefono, email, persona_contacto } = req.body;

  const sql = 'UPDATE proveedores SET nombre_empresa=?, telefono=?, email=?, persona_contacto=? WHERE nit=?';
  const valores = [nombre_empresa, telefono, email, persona_contacto, req.params.nit];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Proveedor actualizado' });
  });
});

router.delete('/:nit', (req, res) => {
  db.query('DELETE FROM proveedores WHERE nit = ?', [req.params.nit], (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Proveedor eliminado' });
  });
});

module.exports = router;
