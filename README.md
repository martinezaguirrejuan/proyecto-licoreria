# Sistema de Gestión - Licorería

**Demo en vivo:** [proyecto-licoreria.vercel.app](https://proyecto-licoreria.vercel.app)

Aplicación web completa para la gestión de una licorería. Desarrollada con React, Node.js, Express y MariaDB.

## Tecnologías

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express  
**Base de datos:** MariaDB  

## Módulos

- [x] Productos — CRUD completo
- [x] Clientes — CRUD completo
- [x] Proveedores — CRUD completo
- [x] Empleados — CRUD completo
- [x] Ventas — crear con carrito, editar estado, ver detalle
- [x] Compras — crear con carrito, editar estado, ver detalle
- [x] Dashboard — tarjetas de resumen y stock bajo
- [x] Reportes — 4 gráficas con Recharts
- [x] Login — autenticación con roles (admin, vendedor, bodega)

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
