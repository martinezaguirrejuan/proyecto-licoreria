# Sistema de Gestión - Licorería

Aplicación web completa para la gestión de una licorería. Desarrollada con React, Node.js, Express y MariaDB.

## Tecnologías

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express  
**Base de datos:** MariaDB  

## Módulos

- [x] Productos — CRUD completo
- [x] Clientes — CRUD completo
- [ ] Proveedores
- [ ] Empleados
- [ ] Ventas
- [ ] Compras
- [ ] Dashboard
- [ ] Reportes

## Cómo correrlo localmente

### Requisitos
- Node.js
- MariaDB

### Base de datos
```bash
mysql -u root < bd/licoreria_COMPLETO.sql
```

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

El backend corre en `http://localhost:3000`  
El frontend corre en `http://localhost:5173`

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@licoreria.com | 1234 |
| Vendedor | vendedor@licoreria.com | 1234 |
| Bodega | bodega@licoreria.com | 1234 |

## Autor

**Juan Fernando Martinez Aguirre**  
Estudiante de Tecnología en Desarrollo de Software  
Medellín, Colombia
