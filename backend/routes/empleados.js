const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM empleados', (error, resultados) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    const resultado = resultados.map(e => ({
      ...e,
      observacion: e.observacion ? e.observacion.toString() : ''
    }))
    res.json(resultado);
  });
});

router.post('/', (req, res) => {
  const { cedula, nombre, cargo, dias_labora, telefono, email, fecha_contratacion, salario } = req.body;

  const sql = 'INSERT INTO empleados (cedula, nombre, cargo, dias_labora, telefono, email, fecha_contratacion, salario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const valores = [cedula, nombre, cargo, dias_labora, telefono, email, fecha_contratacion, salario];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Empleado creado' });
  });
});

router.put('/:cedula', (req, res) => {
  const { nombre, cargo, dias_labora, telefono, email, fecha_contratacion, salario } = req.body;

  const sql = 'UPDATE empleados SET nombre=?, cargo=?, dias_labora=?, telefono=?, email=?, fecha_contratacion=?, salario=? WHERE cedula=?';
  const valores = [nombre, cargo, dias_labora, telefono, email, fecha_contratacion, salario, req.params.cedula];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Empleado actualizado' });
  });
});

router.delete('/:cedula', (req, res) => {
  db.query('DELETE FROM empleados WHERE cedula = ?', [req.params.cedula], (error, resultado) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ mensaje: 'Empleado eliminado' });
  });
});

module.exports = router;
