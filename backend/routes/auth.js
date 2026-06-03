 
  const express = require('express');                                           
  const router = express.Router();                                            
  const db = require('../db');                                                  
                                                                              
  const query = (sql, params = []) =>                                           
    new Promise((resolve, reject) =>
      db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows))   
    );                                                                        
                                                                                
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;                                       
                                                                              
    const rows = await query(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]                                                         
    );
                                                                                
    if (rows.length === 0) {                                                  
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }                                                                           
   
    const usuario = rows[0];                                                    
    res.json({                                                                
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,                                                   
      email: usuario.email,
      rol: usuario.rol                                                          
    });                                                                       
  });

  router.put('/cambiar-password', async (req, res) => {
    const { id_usuario, password_actual, password_nueva } = req.body;

    const rows = await query(
      'SELECT * FROM usuarios WHERE id_usuario = ? AND password = ?',
      [id_usuario, password_actual]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    await query(
      'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
      [password_nueva, id_usuario]
    );

    res.json({ mensaje: 'Contraseña actualizada' });
  });

  module.exports = router;
