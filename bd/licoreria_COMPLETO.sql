-- ================================================================
-- PROYECTO FINAL - SISTEMA DE GESTIÓN DE LICORERÍA
-- Base de Datos Completa y Definitiva  |  Bases de Datos II
-- Juan Fernando Martinez Aguirre  |  CC 100145688
-- Motor: MariaDB 10.4  |  Charset: utf8mb4
-- ================================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS licoreria;
CREATE DATABASE licoreria DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE licoreria;


-- ================================================================
-- PARTE 1: ESTRUCTURA DE TABLAS
-- 8 tablas principales + 6 tablas de resumen = 14 en total
-- ================================================================

-- ---------------------------------------------------------------
-- Tabla: clientes
-- Almacena los datos de los clientes frecuentes de la licorería.
-- ---------------------------------------------------------------
CREATE TABLE `clientes` (
  `cedula`          VARCHAR(20)  NOT NULL,
  `nombre`          VARCHAR(100) NOT NULL,
  `telefono`        VARCHAR(20)  DEFAULT NULL,
  `email`           VARCHAR(100) DEFAULT NULL,
  `direccion`       VARCHAR(150) DEFAULT NULL,
  `fecha_registro`  DATE         DEFAULT (CURDATE()),
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: empleados
-- Registra el personal de la licorería.
-- Usa ENUM (cargo), SET (dias_labora) y BLOB (observacion).
-- ---------------------------------------------------------------
CREATE TABLE `empleados` (
  `cedula`              VARCHAR(20)  NOT NULL,
  `nombre`              VARCHAR(100) NOT NULL,
  `cargo`               ENUM('Gerente','Supervisor','Vendedor','Vendedora',
                             'Cajero','Cajera','Bodeguero','Auxiliar Contable') NOT NULL,
  `dias_labora`         SET('lunes','martes','miercoles','jueves','viernes','sabado')
                        NOT NULL DEFAULT 'lunes,martes,miercoles,jueves,viernes',
  `telefono`            VARCHAR(15)    DEFAULT NULL,
  `email`               VARCHAR(100)   DEFAULT NULL,
  `fecha_contratacion`  DATE           NOT NULL,
  `salario`             DECIMAL(10,2)  DEFAULT NULL,
  `observacion`         BLOB,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: proveedores
-- Empresas y distribuidores que suministran productos.
-- ---------------------------------------------------------------
CREATE TABLE `proveedores` (
  `nit`              VARCHAR(20)  NOT NULL,
  `nombre_empresa`   VARCHAR(100) NOT NULL,
  `direccion`        VARCHAR(150) DEFAULT NULL,
  `telefono`         VARCHAR(15)  DEFAULT NULL,
  `email`            VARCHAR(100) DEFAULT NULL,
  `persona_contacto` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`nit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: productos
-- Catálogo de licores disponibles.
-- Usa ENUM en tipo_licor y categoria.
-- ---------------------------------------------------------------
CREATE TABLE `productos` (
  `id_producto`   INT(11)      NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(100) NOT NULL,
  `tipo_licor`    ENUM('Whisky','Ron','Vodka','Cerveza','Vino','Aguardiente',
                       'Tequila','Ginebra','Brandy','Otro') NOT NULL,
  `marca`         VARCHAR(50)   DEFAULT NULL,
  `categoria`     ENUM('Importado','Nacional','Artesanal') DEFAULT 'Nacional',
  `contenido_ml`  INT(11)       DEFAULT NULL,
  `precio_compra` DECIMAL(10,2) NOT NULL,
  `precio_venta`  DECIMAL(10,2) NOT NULL,
  `stock_actual`  INT(11)       DEFAULT 0,
  `stock_minimo`  INT(11)       DEFAULT 5,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: ventas
-- Encabezado de cada transacción de venta.
-- Usa ENUM en metodo_pago y estado.
-- FK → clientes, empleados (ON DELETE CASCADE)
-- ---------------------------------------------------------------
CREATE TABLE `ventas` (
  `id_venta`        INT(11)       NOT NULL AUTO_INCREMENT,
  `cedula_cliente`  VARCHAR(20)   DEFAULT NULL,
  `cedula_empleado` VARCHAR(20)   NOT NULL,
  `fecha_venta`     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  `total_venta`     DECIMAL(10,2) NOT NULL,
  `metodo_pago`     ENUM('Efectivo','Tarjeta','Transferencia','Nequi','Daviplata') NOT NULL,
  `estado`          ENUM('Completada','Pendiente','Cancelada') DEFAULT 'Completada',
  PRIMARY KEY (`id_venta`),
  KEY `cedula_cliente`  (`cedula_cliente`),
  KEY `cedula_empleado` (`cedula_empleado`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cedula_cliente`)
    REFERENCES `clientes`  (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`cedula_empleado`)
    REFERENCES `empleados` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: compras
-- Encabezado de cada orden de compra a proveedores.
-- Usa ENUM en estado.  FK → proveedores (ON DELETE CASCADE)
-- ---------------------------------------------------------------
CREATE TABLE `compras` (
  `id_compra`      INT(11)       NOT NULL AUTO_INCREMENT,
  `nit_proveedor`  VARCHAR(20)   NOT NULL,
  `fecha_compra`   DATE          NOT NULL,
  `total_compra`   DECIMAL(10,2) NOT NULL,
  `estado`         ENUM('Completada','Pendiente','Cancelada') DEFAULT 'Completada',
  PRIMARY KEY (`id_compra`),
  KEY `nit_proveedor` (`nit_proveedor`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`nit_proveedor`)
    REFERENCES `proveedores` (`nit`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: detalle_ventas
-- Líneas de producto por venta. Resuelve la relación N:M
-- entre ventas y productos. Incluye columna descuento.
-- FK → ventas, productos (ON DELETE CASCADE)
-- ---------------------------------------------------------------
CREATE TABLE `detalle_ventas` (
  `id_detalle_venta` INT(11)       NOT NULL AUTO_INCREMENT,
  `id_venta`         INT(11)       NOT NULL,
  `id_producto`      INT(11)       NOT NULL,
  `cantidad`         INT(11)       NOT NULL,
  `precio_unitario`  DECIMAL(10,2) NOT NULL,
  `descuento`        DECIMAL(5,2)  DEFAULT 0.00,
  `subtotal`         DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_venta`    (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`)
    REFERENCES `ventas`    (`id_venta`)    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------
-- Tabla: detalle_compras
-- Líneas de producto por compra. Resuelve la relación N:M
-- entre compras y productos.
-- FK → compras, productos (ON DELETE CASCADE)
-- ---------------------------------------------------------------
CREATE TABLE `detalle_compras` (
  `id_detalle_compra` INT(11)       NOT NULL AUTO_INCREMENT,
  `id_compra`         INT(11)       NOT NULL,
  `id_producto`       INT(11)       NOT NULL,
  `cantidad`          INT(11)       NOT NULL,
  `precio_unitario`   DECIMAL(10,2) NOT NULL,
  `subtotal`          DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  KEY `id_compra`   (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_compra`)
    REFERENCES `compras`   (`id_compra`)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ================================================================
-- PARTE 2: DATOS DE PRUEBA
-- ================================================================

INSERT INTO `clientes` VALUES
('1122334455','Carlos Rodríguez','3187654321','carlos.rod@email.com','Avenida 20 #12-45 Envigado','2024-03-10'),
('1234567890','Juan Pérez García','3151234567','juan.perez@email.com','Calle 10 #5-20 Medellín','2024-01-15'),
('2233445566','María Fernanda Soto','3196543210','mafe.soto@email.com','Calle 45 #23-67 Bello','2024-04-05'),
('3344556677','Pedro Antonio Ruiz','3145678901','pedro.ruiz@email.com','Carrera 70 #34-12 Medellín','2024-05-12'),
('4455667788','Laura Valentina Castro','3167890123','laura.castro@email.com','Calle 33 #55-22 Itagüí','2024-06-18'),
('5566778899','Diego Alejandro Mora','3178901234','diego.mora@email.com','Avenida 80 #45-90 Medellín','2024-07-22'),
('6677889900','Claudia Patricia Diaz','3189012345','claudia.diaz@email.com','Carrera 50 #60-33 Sabaneta','2024-08-08'),
('7788990011','Andrés Felipe Torres','3190123456','andres.torres@email.com','Calle 10 Sur #28-45 Envigado','2024-09-14'),
('8899001122','Natalia Andrea Vega','3101234567','natalia.vega@email.com','Carrera 43A #12-88 Medellín','2024-10-01'),
('9876543210','Ana María López','3209876543','ana.lopez@email.com','Carrera 15 #8-30 Medellín','2024-02-20');

INSERT INTO `empleados` VALUES
('43210987','Pedro Sánchez Gómez','Gerente','lunes,martes,miercoles,jueves,viernes','3101112233','pedro.sanchez@licoreria.com','2023-01-10',2500000.00,'Líder del equipo, responsable y organizado'),
('43219876','Laura Martínez Pérez','Vendedora','lunes,martes,miercoles,jueves,viernes','3204445566','laura.martinez@licoreria.com','2023-06-15',1500000.00,'Puntual, proactiva, excelente atención al cliente'),
('43228765','Diego Castro López','Cajero','lunes,martes,miercoles,jueves,viernes,sabado','3157778899','diego.castro@licoreria.com','2024-01-20',1400000.00,'Responsable con el manejo de efectivo'),
('43237654','Sandra Milena Rojas','Vendedora','lunes,martes,miercoles,jueves,viernes','3168889900','sandra.rojas@licoreria.com','2023-08-05',1500000.00,'Buena atención al cliente, puntual'),
('43246543','Jorge Luis Ramírez','Bodeguero','martes,miercoles,jueves,viernes,sabado','3179990011','jorge.ramirez@licoreria.com','2023-03-12',1300000.00,'Organizado con el inventario y despachos'),
('43255432','Carolina Vélez Muñoz','Cajera','lunes,miercoles,viernes,sabado','3180001122','carolina.velez@licoreria.com','2023-11-22',1400000.00,'Ágil con el sistema de caja, confiable'),
('43264321','Miguel Ángel Cárdenas','Vendedor','lunes,martes,jueves,viernes','3191112233','miguel.cardenas@licoreria.com','2024-02-14',1500000.00,'Buen vendedor, persuasivo y carismático'),
('43273210','Juliana Andrea Osorio','Auxiliar Contable','lunes,martes,miercoles,jueves,viernes','3102223344','juliana.osorio@licoreria.com','2023-05-18',1600000.00,'Precisa con los registros contables'),
('43282109','Ricardo Andrés Suárez','Supervisor','lunes,martes,miercoles,jueves,viernes,sabado','3213334455','ricardo.suarez@licoreria.com','2023-02-28',1800000.00,'Supervisión efectiva del equipo de trabajo'),
('43290998','Paola Andrea Jiménez','Vendedora','martes,miercoles,jueves,viernes,sabado','3154445566','paola.jimenez@licoreria.com','2024-03-30',1500000.00,'Excelente trato con clientes, perseverante');

INSERT INTO `proveedores` VALUES
('900123456-1','Licores del Valle S.A.','Calle 50 #30-20 Medellín','3001234567','ventas@licdelvalle.com','Carlos Mendez'),
('900234567-2','Distribuidora Nacional','Carrera 80 #45-10 Bogotá','3109876543','contacto@distnacional.com','Maria Rodriguez'),
('900345678-3','Importadora Premium','Avenida 68 #25-35 Cali','3207654321','info@imppremium.com','Luis Gomez'),
('900456789-4','Bebidas Selectas Ltda','Calle 100 #15-25 Barranquilla','3156543210','ventas@bebidaselectas.com','Ana Patricia Silva'),
('900567890-5','Comercializadora Andina','Carrera 7 #32-16 Bucaramanga','3189876543','comercial@andina.com','Roberto Vargas'),
('900678901-6','Licores Importados SAS','Calle 85 #50-40 Medellín','3145678901','ventas@licimportados.com','Diana Morales'),
('900789012-7','Distribuciones El Barril','Avenida 30 #45-18 Pereira','3167890123','info@elbarril.com','Fernando Castillo'),
('900890123-8','Licorería La Bodega','Carrera 15 #28-45 Manizales','3198901234','contacto@labodega.com','Patricia Herrera'),
('900901234-9','Vinos y Licores Premium','Calle 72 #10-34 Cartagena','3120123456','ventas@vinospremium.com','Camilo Ortiz'),
('901012345-0','Bebidas Gourmet','Avenida Jiménez #8-43 Bogotá','3131234567','info@bebidasgourmet.com','Sandra Rios');

INSERT INTO `productos` VALUES
(1,'Whisky Old Parr 12 años','Whisky','Old Parr','Importado',750,85000.00,120000.00,10,5),
(2,'Ron Medellín Añejo','Ron','Ron Medellín','Nacional',750,35000.00,50000.00,25,10),
(3,'Vodka Absolut','Vodka','Absolut','Importado',750,45000.00,65000.00,20,8),
(4,'Cerveza Poker Lata','Cerveza','Poker','Nacional',330,1200.00,2000.00,200,50),
(5,'Vino Casillero del Diablo','Vino','Casillero del Diablo','Importado',750,25000.00,38000.00,30,10),
(6,'Aguardiente Antioqueño','Aguardiente','Antioqueño','Nacional',750,18000.00,28000.00,50,15),
(7,'Tequila José Cuervo','Tequila','José Cuervo','Importado',750,55000.00,78000.00,12,5),
(8,'Cerveza Corona Botella','Cerveza','Corona','Nacional',355,2500.00,4000.00,150,40),
(9,'Whisky Buchanans 12 años','Whisky','Buchanans','Importado',750,95000.00,135000.00,10,5),
(10,'Ron Santa Teresa 1796','Ron','Santa Teresa','Importado',750,120000.00,170000.00,8,3);

INSERT INTO `compras` VALUES
(1,'900123456-1','2024-10-01',2550000.00,'Completada'),
(2,'900234567-2','2024-10-03',1800000.00,'Completada'),
(3,'900345678-3','2024-10-05',3200000.00,'Completada'),
(4,'900456789-4','2024-10-08',1450000.00,'Completada'),
(5,'900567890-5','2024-10-10',2100000.00,'Completada'),
(6,'900678901-6','2024-10-12',1900000.00,'Completada'),
(7,'900789012-7','2024-10-15',2750000.00,'Completada'),
(8,'900890123-8','2024-10-18',1650000.00,'Completada'),
(9,'900901234-9','2024-10-20',2850000.00,'Completada'),
(10,'901012345-0','2024-10-22',3100000.00,'Completada');

INSERT INTO `detalle_compras` VALUES
(1,1,1,20,85000.00,1700000.00),
(2,1,3,10,45000.00,450000.00),
(3,2,2,30,35000.00,1050000.00),
(4,2,6,40,18000.00,720000.00),
(5,3,7,15,55000.00,825000.00),
(6,4,4,100,1200.00,120000.00),
(7,5,5,50,25000.00,1250000.00),
(8,6,8,80,2500.00,200000.00),
(9,7,9,20,95000.00,1900000.00),
(10,8,10,10,120000.00,1200000.00);

INSERT INTO `ventas` VALUES
(1,'1234567890','43219876','2024-10-20 14:30:00',185000.00,'Efectivo','Completada'),
(2,'9876543210','43228765','2024-10-21 16:45:00',146000.00,'Tarjeta','Completada'),
(3,'1122334455','43219876','2024-10-22 11:20:00',56000.00,'Efectivo','Completada'),
(4,'2233445566','43237654','2024-10-23 10:15:00',270000.00,'Transferencia','Completada'),
(5,'3344556677','43255432','2024-10-24 15:40:00',92000.00,'Tarjeta','Completada'),
(6,'4455667788','43264321','2024-10-25 12:30:00',204000.00,'Efectivo','Completada'),
(7,'5566778899','43290998','2024-10-26 09:50:00',78000.00,'Tarjeta','Completada'),
(8,NULL,'43219876','2024-10-27 14:20:00',32000.00,'Efectivo','Completada'),
(9,'7788990011','43228765','2024-10-27 16:10:00',135000.00,'Transferencia','Completada'),
(10,'8899001122','43237654','2024-10-28 11:45:00',158000.00,'Tarjeta','Completada');

INSERT INTO `detalle_ventas` VALUES
(1,1,1,1,120000.00,0.00,120000.00),
(2,1,3,1,65000.00,0.00,65000.00),
(3,2,5,2,38000.00,0.00,76000.00),
(4,2,6,2,28000.00,0.00,56000.00),
(5,3,2,1,50000.00,0.00,50000.00),
(6,4,9,2,135000.00,0.00,270000.00),
(7,5,4,10,2000.00,0.00,20000.00),
(8,6,7,2,78000.00,0.00,156000.00),
(9,7,6,2,28000.00,0.00,56000.00),
(10,8,4,16,2000.00,0.00,32000.00),
(11,1,1,2,5000.00,0.00,10000.00);


-- ================================================================
-- PARTE 3: TRIGGER
-- Nombre   : descontar_stock
-- Evento   : AFTER INSERT en detalle_ventas
-- Propósito: Descontar automáticamente el stock del producto
--            cada vez que se registra una línea de venta.
-- ================================================================

DELIMITER ;;
CREATE TRIGGER `descontar_stock`
AFTER INSERT ON `detalle_ventas`
FOR EACH ROW
BEGIN
  UPDATE productos
  SET stock_actual = stock_actual - NEW.cantidad
  WHERE id_producto = NEW.id_producto;
END;;
DELIMITER ;


-- ================================================================
-- PARTE 4: TABLAS DE RESUMEN  (CREATE TABLE ... SELECT)
-- Generadas dinámicamente — sin llaves foráneas
-- Propósito: proveer reportes analíticos del negocio
-- ================================================================

-- a. Resumen de productos por tipo de licor
DROP TABLE IF EXISTS resumen_por_tipo;
CREATE TABLE resumen_por_tipo
    SELECT tipo_licor,
           COUNT(*)           AS cantidad_productos,
           AVG(precio_venta)  AS precio_promedio_venta,
           SUM(stock_actual)  AS stock_total
    FROM productos
    GROUP BY tipo_licor;

-- b. Total de ventas completadas por método de pago
DROP TABLE IF EXISTS ventas_por_metodo;
CREATE TABLE ventas_por_metodo
    SELECT metodo_pago,
           COUNT(*)           AS cantidad_ventas,
           SUM(total_venta)   AS total_recaudado,
           AVG(total_venta)   AS promedio_venta
    FROM ventas
    WHERE estado = 'Completada'
    GROUP BY metodo_pago;

-- c. Productos con stock igual o por debajo del mínimo
DROP TABLE IF EXISTS productos_stock_bajo;
CREATE TABLE productos_stock_bajo
    SELECT id_producto, nombre, tipo_licor, categoria,
           stock_actual, stock_minimo
    FROM productos
    WHERE stock_actual <= stock_minimo;

-- d. Ranking de empleados por monto vendido
DROP TABLE IF EXISTS ranking_empleados;
CREATE TABLE ranking_empleados
    SELECT e.cedula, e.nombre, e.cargo,
           COUNT(v.id_venta)   AS total_ventas,
           SUM(v.total_venta)  AS monto_total
    FROM empleados e
    JOIN ventas v ON e.cedula = v.cedula_empleado
    GROUP BY e.cedula, e.nombre, e.cargo
    ORDER BY monto_total DESC;

-- e. Productos más vendidos por unidades
DROP TABLE IF EXISTS productos_mas_vendidos;
CREATE TABLE productos_mas_vendidos
    SELECT p.id_producto, p.nombre, p.tipo_licor,
           SUM(dv.cantidad)   AS unidades_vendidas,
           SUM(dv.subtotal)   AS ingresos_generados
    FROM productos p
    JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
    GROUP BY p.id_producto, p.nombre, p.tipo_licor
    ORDER BY unidades_vendidas DESC;

-- f. Resumen de compras por proveedor
DROP TABLE IF EXISTS resumen_proveedores;
CREATE TABLE resumen_proveedores
    SELECT pr.nit, pr.nombre_empresa,
           COUNT(c.id_compra)  AS total_compras,
           SUM(c.total_compra) AS monto_total,
           AVG(c.total_compra) AS promedio_compra
    FROM proveedores pr
    JOIN compras c ON pr.nit = c.nit_proveedor
    GROUP BY pr.nit, pr.nombre_empresa;


-- ================================================================
-- PARTE 5: CONSULTAS DEL PROYECTO
-- ================================================================


-- ----------------------------------------------------------------
-- BLOQUE A: CRUD BÁSICO
-- ----------------------------------------------------------------

-- ┌── CONSULTA 1: Ver estructura de la base de datos ─────────────
-- │ Tablas      : (ninguna — comandos de metadatos)
-- │ Qué hace    : Muestra las bases de datos y las tablas del
-- │               sistema para verificar que la BD fue creada.
-- │ Cómo        : SHOW DATABASES y SHOW TABLES de MariaDB.
-- │ Resultado   : Lista de BDs disponibles y 14 tablas de licoreria.
-- └────────────────────────────────────────────────────────────────
SHOW DATABASES;
USE licoreria;
SHOW TABLES;

-- ┌── CONSULTA 2: Listar todos los clientes ──────────────────────
-- │ Tablas      : clientes
-- │ Qué hace    : Muestra la información de contacto de todos los
-- │               clientes registrados en la licorería.
-- │ Cómo        : SELECT especificando columnas cedula, nombre,
-- │               telefono y email de la tabla clientes.
-- │ Resultado   : 10 registros con los datos de contacto de cada
-- │               cliente registrado.
-- └────────────────────────────────────────────────────────────────
SELECT cedula, nombre, telefono, email FROM clientes;

-- ┌── CONSULTA 3: Productos que requieren reabastecimiento ────────
-- │ Tablas      : productos
-- │ Qué hace    : Detecta los productos cuyo nivel de inventario
-- │               está en o por debajo del mínimo permitido.
-- │ Cómo        : SELECT con WHERE comparando stock_actual <=
-- │               stock_minimo sobre la tabla productos.
-- │ Resultado   : Lista de productos que necesitan reabastecimiento
-- │               urgente (Cerveza Poker, Tequila, Whiskys, etc.).
-- └────────────────────────────────────────────────────────────────
SELECT nombre, tipo_licor, stock_actual, stock_minimo
FROM productos
WHERE stock_actual <= stock_minimo;

-- ┌── CONSULTA 4: Insertar un nuevo cliente ───────────────────────
-- │ Tablas      : clientes
-- │ Qué hace    : Agrega un nuevo cliente al sistema de gestión.
-- │ Cómo        : INSERT INTO clientes especificando cedula, nombre,
-- │               telefono, email y dirección del nuevo registro.
-- │ Resultado   : Un registro nuevo queda almacenado con todos sus
-- │               datos de contacto.
-- └────────────────────────────────────────────────────────────────
INSERT INTO clientes (cedula, nombre, telefono, email, direccion)
VALUES ('9001234567', 'Carlos Alberto Restrepo', '3001234567',
        'carlos.restrepo@email.com', 'Calle 80 #45-20 Medellín');

-- ┌── CONSULTA 5: Actualizar precio de venta de un producto ───────
-- │ Tablas      : productos
-- │ Qué hace    : Modifica el precio de venta de un producto
-- │               existente en el catálogo.
-- │ Cómo        : UPDATE productos SET precio_venta con WHERE
-- │               identificando el producto por nombre.
-- │ Resultado   : El precio del Whisky Old Parr 12 años pasa
-- │               de $120.000 a $125.000.
-- └────────────────────────────────────────────────────────────────
UPDATE productos
SET precio_venta = 125000.00
WHERE nombre = 'Whisky Old Parr 12 años';

-- ┌── CONSULTA 6: Eliminar clientes sin ventas registradas ────────
-- │ Tablas      : clientes, ventas
-- │ Qué hace    : Elimina del sistema los clientes que nunca han
-- │               realizado ninguna compra.
-- │ Cómo        : DELETE con NOT IN apuntando a una subconsulta
-- │               que obtiene las cédulas únicas de la tabla ventas.
-- │ Resultado   : Se eliminan los clientes sin historial; la BD
-- │               queda solo con clientes activos.
-- └────────────────────────────────────────────────────────────────
DELETE FROM clientes
WHERE cedula NOT IN (
    SELECT DISTINCT cedula_cliente FROM ventas
    WHERE cedula_cliente IS NOT NULL
);


-- ----------------------------------------------------------------
-- BLOQUE B: TIPOS DE DATOS ESPECIALES — ENUM, SET Y BLOB
-- ----------------------------------------------------------------

-- ┌── CONSULTA 7: Filtrar vendedores por valor ENUM ───────────────
-- │ Tablas      : empleados
-- │ Qué hace    : Lista todos los empleados con cargo de ventas.
-- │ Cómo        : WHERE cargo IN ('Vendedor','Vendedora') usando
-- │               directamente el valor textual del ENUM.
-- │ Resultado   : 4 registros: Laura Martínez, Sandra Rojas,
-- │               Miguel Cárdenas y Paola Jiménez.
-- └────────────────────────────────────────────────────────────────
SELECT cedula, nombre, cargo, salario
FROM empleados
WHERE cargo IN ('Vendedor','Vendedora');

-- ┌── CONSULTA 8: Filtrar ENUM por su valor numérico interno ──────
-- │ Tablas      : empleados
-- │ Qué hace    : Demuestra que MariaDB asigna un índice numérico
-- │               a cada valor ENUM. El 3 corresponde a 'Vendedor'.
-- │ Cómo        : WHERE cargo = 3  (posición en la lista del ENUM).
-- │ Resultado   : Solo los empleados con cargo exactamente
-- │               'Vendedor' (no 'Vendedora', que es índice 4).
-- └────────────────────────────────────────────────────────────────
SELECT cedula, nombre, cargo
FROM empleados
WHERE cargo = 3;

-- ┌── CONSULTA 9: Empleados que NO trabajan el miércoles (SET) ────
-- │ Tablas      : empleados
-- │ Qué hace    : Identifica empleados cuyo horario no incluye
-- │               el día miércoles.
-- │ Cómo        : NOT FIND_IN_SET('miercoles', dias_labora) busca
-- │               la ausencia del valor en el campo SET.
-- │ Resultado   : Miguel Cárdenas (lun,mar,jue,vie) y Carolina
-- │               Vélez (lun,mie,vie,sab) — esperar solo quienes
-- │               no tienen miércoles en su SET.
-- └────────────────────────────────────────────────────────────────
SELECT nombre, cargo, dias_labora
FROM empleados
WHERE NOT FIND_IN_SET('miercoles', dias_labora);

-- ┌── CONSULTA 10: Empleados de ventas que trabajan sábado ────────
-- │ Tablas      : empleados
-- │ Qué hace    : Encuentra el personal de ventas disponible
-- │               los fines de semana.
-- │ Cómo        : FIND_IN_SET para verificar presencia de 'sabado'
-- │               en el SET combinado con filtro ENUM sobre cargo.
-- │ Resultado   : Diego Castro (Cajero), Carolina Vélez (Cajera)
-- │               y Paola Jiménez (Vendedora).
-- └────────────────────────────────────────────────────────────────
SELECT nombre, cargo, dias_labora
FROM empleados
WHERE FIND_IN_SET('sabado', dias_labora)
  AND cargo IN ('Vendedor','Vendedora','Cajero','Cajera');

-- ┌── CONSULTA 11: Productos importados (ENUM categoria) ──────────
-- │ Tablas      : productos
-- │ Qué hace    : Muestra el catálogo de productos importados.
-- │ Cómo        : WHERE categoria = 'Importado' filtra directamente
-- │               el valor del campo ENUM categoria.
-- │ Resultado   : 6 productos: Whisky Old Parr, Vodka Absolut,
-- │               Vino Casillero, Tequila Cuervo, Whisky Buchanans,
-- │               Ron Santa Teresa.
-- └────────────────────────────────────────────────────────────────
SELECT nombre, tipo_licor, categoria, precio_venta
FROM productos
WHERE categoria = 'Importado';

-- ┌── CONSULTA 12: Ventas pagadas con Efectivo (ENUM metodo_pago) ─
-- │ Tablas      : ventas
-- │ Qué hace    : Filtra las ventas realizadas en efectivo.
-- │ Cómo        : WHERE metodo_pago = 'Efectivo' filtra el ENUM.
-- │ Resultado   : 3 ventas en efectivo con sus fechas y montos.
-- └────────────────────────────────────────────────────────────────
SELECT id_venta, cedula_cliente, total_venta, fecha_venta
FROM ventas
WHERE metodo_pago = 'Efectivo';

-- ┌── CONSULTA 13: Vendedores sin miércoles (ENUM + SET combinados)
-- │ Tablas      : empleados
-- │ Qué hace    : Combina un filtro ENUM y un filtro SET en una
-- │               sola consulta para segmentar horarios específicos.
-- │ Cómo        : WHERE cargo IN ENUM y NOT FIND_IN_SET sobre SET.
-- │ Resultado   : Vendedores cuyo horario no incluye el miércoles;
-- │               útil para planificar turnos de cobertura.
-- └────────────────────────────────────────────────────────────────
SELECT nombre, cargo, dias_labora
FROM empleados
WHERE cargo IN ('Vendedor','Vendedora')
  AND NOT FIND_IN_SET('miercoles', dias_labora);


-- ----------------------------------------------------------------
-- BLOQUE C: VER TABLAS DE RESUMEN (generadas en Parte 4)
-- ----------------------------------------------------------------

-- ┌── CONSULTA 14: Ranking de empleados por ventas ────────────────
-- │ Tablas      : ranking_empleados (tabla de resumen)
-- │ Qué hace    : Muestra el desempeño de cada empleado ordenado
-- │               por monto total vendido de mayor a menor.
-- │ Cómo        : SELECT * sobre la tabla resumen ya generada.
-- │ Resultado   : Lista con cedula, nombre, cargo, total_ventas
-- │               y monto_total por empleado.
-- └────────────────────────────────────────────────────────────────
SELECT * FROM ranking_empleados;

-- ┌── CONSULTA 15: Productos más vendidos ─────────────────────────
-- │ Tablas      : productos_mas_vendidos (tabla de resumen)
-- │ Qué hace    : Muestra el ranking de productos por unidades
-- │               vendidas e ingresos generados.
-- │ Cómo        : SELECT * sobre la tabla resumen ya generada.
-- │ Resultado   : Productos ordenados de mayor a menor movimiento
-- │               de ventas.
-- └────────────────────────────────────────────────────────────────
SELECT * FROM productos_mas_vendidos;

-- ┌── CONSULTA 16: Ventas por método de pago ──────────────────────
-- │ Tablas      : ventas_por_metodo (tabla de resumen)
-- │ Qué hace    : Muestra cuánto se recaudó con cada método de pago.
-- │ Cómo        : SELECT * sobre la tabla resumen ya generada.
-- │ Resultado   : Efectivo, Tarjeta, Transferencia con sus totales.
-- └────────────────────────────────────────────────────────────────
SELECT * FROM ventas_por_metodo;

-- ┌── CONSULTA 17: Productos con stock bajo ───────────────────────
-- │ Tablas      : productos_stock_bajo (tabla de resumen)
-- │ Qué hace    : Lista los productos que requieren reabastecimiento.
-- │ Cómo        : SELECT * sobre la tabla resumen ya generada.
-- │ Resultado   : Productos con stock_actual <= stock_minimo.
-- └────────────────────────────────────────────────────────────────
SELECT * FROM productos_stock_bajo;


-- ----------------------------------------------------------------
-- BLOQUE D: INSERT INTO ... SELECT
-- ----------------------------------------------------------------

-- ┌── CONSULTA 18: Registrar venta buscando empleado por nombre ───
-- │ Tablas      : ventas, empleados (origen)
-- │ Qué hace    : Inserta una nueva venta sin necesidad de conocer
-- │               de memoria la cédula del empleado que la atiende.
-- │ Cómo        : INSERT INTO ventas ... SELECT ... FROM empleados
-- │               WHERE nombre = 'Laura Martínez Pérez'.
-- │ Resultado   : Nueva venta registrada con la cédula obtenida
-- │               automáticamente de la tabla empleados.
-- └────────────────────────────────────────────────────────────────
INSERT INTO ventas (cedula_cliente, cedula_empleado, total_venta, metodo_pago, estado)
    SELECT '3344556677', cedula, 56000, 'Efectivo', 'Completada'
    FROM empleados
    WHERE nombre = 'Laura Martínez Pérez';

-- ┌── CONSULTA 19: Agregar detalle buscando producto por nombre ───
-- │ Tablas      : detalle_ventas, productos (origen), ventas (MAX)
-- │ Qué hace    : Inserta la línea de detalle de la venta recién
-- │               creada buscando el producto por nombre.
-- │ Cómo        : INSERT INTO detalle_ventas ... SELECT usando
-- │               subconsulta MAX(id_venta) para referenciar la
-- │               última venta y buscando el producto por nombre.
-- │ Resultado   : Nueva línea de detalle asociada a la última venta
-- │               con Aguardiente Antioqueño × 2 unidades.
-- └────────────────────────────────────────────────────────────────
INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal)
    SELECT (SELECT MAX(id_venta) FROM ventas),
           id_producto, 2, precio_venta, 0.00, precio_venta * 2
    FROM productos
    WHERE nombre = 'Aguardiente Antioqueño';

-- ┌── CONSULTA 20: Insertar en stock bajo solo los no registrados ─
-- │ Tablas      : productos_stock_bajo (destino), productos (origen)
-- │ Qué hace    : Actualiza la tabla de alerta de stock sin
-- │               duplicar registros ya existentes.
-- │ Cómo        : INSERT ... SELECT con NOT IN para verificar que
-- │               el producto no esté ya en productos_stock_bajo.
-- │ Resultado   : Solo se insertan los productos nuevos con stock
-- │               bajo que aún no aparecían en la tabla de alerta.
-- └────────────────────────────────────────────────────────────────
INSERT INTO productos_stock_bajo (id_producto, nombre, tipo_licor, categoria, stock_actual, stock_minimo)
    SELECT id_producto, nombre, tipo_licor, categoria, stock_actual, stock_minimo
    FROM productos
    WHERE stock_actual <= stock_minimo
      AND id_producto NOT IN (SELECT id_producto FROM productos_stock_bajo);


-- ----------------------------------------------------------------
-- BLOQUE E: UPDATE Y DELETE CON JOIN (EN CASCADA)
-- ----------------------------------------------------------------

-- ┌── CONSULTA 21: UPDATE con JOIN — descuento en cervezas ────────
-- │ Tablas      : detalle_ventas, productos
-- │ Qué hace    : Aplica un descuento del 10% a todas las líneas
-- │               de venta que correspondan a productos de tipo
-- │               Cerveza.
-- │ Cómo        : UPDATE con JOIN entre detalle_ventas y productos
-- │               filtrando tipo_licor = 'Cerveza'; SET actualiza
-- │               descuento y recalcula subtotal.
-- │ Resultado   : Las cervezas (Poker y Corona) quedan con
-- │               descuento = precio_unitario × 0.10 y subtotal
-- │               reducido al 90% del original.
-- └────────────────────────────────────────────────────────────────
UPDATE detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    SET dv.descuento = ROUND(dv.precio_unitario * 0.10, 2),
        dv.subtotal  = ROUND(dv.cantidad * dv.precio_unitario * 0.90, 2)
WHERE p.tipo_licor = 'Cerveza';

-- ┌── CONSULTA 22: UPDATE en cascada — cancelar venta y reponer stock
-- │ Tablas      : ventas, detalle_ventas, productos
-- │ Qué hace    : Cancela la venta #7 y al mismo tiempo repone el
-- │               stock de todos sus productos en una sola operación.
-- │ Cómo        : UPDATE con JOIN triple (ventas + detalle_ventas +
-- │               productos); SET cambia estado = 'Cancelada' y
-- │               stock_actual = stock_actual + cantidad devuelta.
-- │ Resultado   : Venta #7 queda Cancelada y el inventario de
-- │               Aguardiente Antioqueño se incrementa con las
-- │               unidades devueltas.
-- └────────────────────────────────────────────────────────────────
UPDATE ventas v
    JOIN detalle_ventas dv ON v.id_venta    = dv.id_venta
    JOIN productos p       ON dv.id_producto = p.id_producto
    SET v.estado       = 'Cancelada',
        p.stock_actual = p.stock_actual + dv.cantidad
WHERE v.id_venta = 7;

-- ┌── CONSULTA 23: DELETE con JOIN — detalles de ventas canceladas ─
-- │ Tablas      : detalle_ventas, ventas
-- │ Qué hace    : Elimina los registros de detalle de todas las
-- │               ventas cuyo estado es 'Cancelada'.
-- │ Cómo        : DELETE dv FROM detalle_ventas con JOIN a ventas
-- │               filtrando estado = 'Cancelada'.
-- │ Resultado   : Las líneas de detalle de ventas canceladas
-- │               quedan eliminadas de la tabla detalle_ventas.
-- └────────────────────────────────────────────────────────────────
DELETE dv FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
WHERE v.estado = 'Cancelada';

-- ┌── CONSULTA 24: DELETE en cascada — venta cancelada y detalles ─
-- │ Tablas      : ventas, detalle_ventas
-- │ Qué hace    : Borra simultáneamente la venta cancelada y todos
-- │               sus registros de detalle en una sola sentencia.
-- │ Cómo        : DELETE v, dv FROM ventas con JOIN a detalle_ventas
-- │               filtrando estado = 'Cancelada'.
-- │ Resultado   : La venta #7 y sus líneas de detalle desaparecen
-- │               de ambas tablas al mismo tiempo.
-- └────────────────────────────────────────────────────────────────
DELETE v, dv FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
WHERE v.estado = 'Cancelada';

-- ┌── CONSULTA 25: DELETE — eliminar registros huérfanos ──────────
-- │ Tablas      : detalle_ventas, ventas
-- │ Qué hace    : Elimina líneas de detalle que apuntan a ventas
-- │               que ya no existen en la tabla ventas.
-- │ Cómo        : DELETE con LEFT JOIN y WHERE id_venta IS NULL
-- │               identifica los registros sin padre.
-- │ Resultado   : La tabla detalle_ventas queda sin registros
-- │               huérfanos — integridad referencial garantizada.
-- └────────────────────────────────────────────────────────────────
DELETE dv FROM detalle_ventas dv
    LEFT JOIN ventas v ON dv.id_venta = v.id_venta
WHERE v.id_venta IS NULL;


-- ----------------------------------------------------------------
-- BLOQUE F: SUBCONSULTAS
-- ----------------------------------------------------------------

-- ┌── CONSULTA 26: Subconsulta escalar — precio mayor al promedio ─
-- │ Tablas      : productos
-- │ Qué hace    : Muestra los productos cuyo precio de venta supera
-- │               el precio promedio del catálogo.
-- │ Cómo        : WHERE precio_venta > (SELECT AVG(precio_venta)
-- │               FROM productos) — subconsulta escalar que calcula
-- │               el promedio internamente.
-- │ Resultado   : Whisky Buchanans, Ron Santa Teresa, Whisky Old
-- │               Parr, Tequila Cuervo y Vodka Absolut.
-- └────────────────────────────────────────────────────────────────
SELECT nombre, tipo_licor, precio_venta
FROM productos
WHERE precio_venta > (SELECT AVG(precio_venta) FROM productos)
ORDER BY precio_venta DESC;

-- ┌── CONSULTA 27: Subconsulta escalar — venta de mayor valor ─────
-- │ Tablas      : ventas
-- │ Qué hace    : Recupera la venta con el monto más alto registrado.
-- │ Cómo        : WHERE total_venta = (SELECT MAX(total_venta)
-- │               FROM ventas) — subconsulta escalar con MAX().
-- │ Resultado   : La venta #4 por $270.000 (Transferencia) aparece
-- │               como la transacción de mayor valor.
-- └────────────────────────────────────────────────────────────────
SELECT id_venta, cedula_cliente, total_venta, metodo_pago
FROM ventas
WHERE total_venta = (SELECT MAX(total_venta) FROM ventas);

-- ┌── CONSULTA 28: Subconsulta con IN — clientes que han comprado ─
-- │ Tablas      : clientes, ventas
-- │ Qué hace    : Lista los clientes que tienen al menos una venta
-- │               registrada en el sistema.
-- │ Cómo        : WHERE cedula IN (SELECT DISTINCT cedula_cliente
-- │               FROM ventas WHERE cedula_cliente IS NOT NULL).
-- │ Resultado   : Clientes activos con historial de compras.
-- └────────────────────────────────────────────────────────────────
SELECT cedula, nombre, email
FROM clientes
WHERE cedula IN (
    SELECT DISTINCT cedula_cliente FROM ventas
    WHERE cedula_cliente IS NOT NULL
);

-- ┌── CONSULTA 29: Subconsulta con NOT IN — clientes sin compras ──
-- │ Tablas      : clientes, ventas
-- │ Qué hace    : Identifica clientes registrados que nunca han
-- │               realizado ninguna compra.
-- │ Cómo        : WHERE cedula NOT IN (SELECT DISTINCT
-- │               cedula_cliente FROM ventas ...).
-- │ Resultado   : Clientes potenciales para campañas de activación.
-- └────────────────────────────────────────────────────────────────
SELECT cedula, nombre, telefono
FROM clientes
WHERE cedula NOT IN (
    SELECT DISTINCT cedula_cliente FROM ventas
    WHERE cedula_cliente IS NOT NULL
);

-- ┌── CONSULTA 30: Subconsulta en FROM — empleados con más de 1 venta
-- │ Tablas      : empleados, ventas
-- │ Qué hace    : Muestra los empleados que han procesado más de
-- │               una venta, ordenados de mayor a menor actividad.
-- │ Cómo        : Subconsulta en FROM (tabla derivada) con JOIN +
-- │               COUNT; la consulta externa filtra con WHERE > 1.
-- │ Resultado   : Laura Martínez (3 ventas), Diego Castro y
-- │               Sandra Rojas (2 ventas cada uno).
-- └────────────────────────────────────────────────────────────────
SELECT emp_ventas.nombre, emp_ventas.cargo, emp_ventas.total_ventas
FROM (
    SELECT e.nombre, e.cargo, COUNT(v.id_venta) AS total_ventas
    FROM empleados e
    JOIN ventas v ON e.cedula = v.cedula_empleado
    GROUP BY e.cedula, e.nombre, e.cargo
) AS emp_ventas
WHERE emp_ventas.total_ventas > 1
ORDER BY emp_ventas.total_ventas DESC;

-- ┌── CONSULTA 31: Subconsulta escalar — proveedor más reciente ───
-- │ Tablas      : proveedores, compras
-- │ Qué hace    : Obtiene los datos del proveedor que realizó la
-- │               última orden de compra registrada.
-- │ Cómo        : WHERE nit = (SELECT nit_proveedor FROM compras
-- │               ORDER BY fecha_compra DESC LIMIT 1).
-- │ Resultado   : Bebidas Gourmet (nit 901012345-0), cuya compra
-- │               fue el 2024-10-22.
-- └────────────────────────────────────────────────────────────────
SELECT nombre_empresa, telefono, persona_contacto
FROM proveedores
WHERE nit = (
    SELECT nit_proveedor FROM compras
    ORDER BY fecha_compra DESC LIMIT 1
);

-- ┌── CONSULTA 32: Subconsulta con IN — productos vendidos >1 vez ─
-- │ Tablas      : productos, detalle_ventas
-- │ Qué hace    : Identifica los productos que aparecen en más de
-- │               un registro de detalle de ventas.
-- │ Cómo        : WHERE id_producto IN (SELECT id_producto FROM
-- │               detalle_ventas GROUP BY ... HAVING COUNT(*) > 1).
-- │ Resultado   : Productos con movimiento repetido: Whisky Old
-- │               Parr (2 líneas), Cerveza Poker (2 líneas), etc.
-- └────────────────────────────────────────────────────────────────
SELECT nombre, tipo_licor, precio_venta, stock_actual
FROM productos
WHERE id_producto IN (
    SELECT id_producto FROM detalle_ventas
    GROUP BY id_producto
    HAVING COUNT(*) > 1
);

-- ┌── CONSULTA 33: Subconsulta con NOT IN — proveedores sin compras
-- │ Tablas      : proveedores, compras
-- │ Qué hace    : Detecta proveedores registrados que nunca han
-- │               tenido órdenes de compra asociadas.
-- │ Cómo        : WHERE nit NOT IN (SELECT DISTINCT nit_proveedor
-- │               FROM compras).
-- │ Resultado   : Proveedores sin movimiento — candidatos a
-- │               revisar o depurar del catálogo.
-- └────────────────────────────────────────────────────────────────
SELECT nit, nombre_empresa, persona_contacto
FROM proveedores
WHERE nit NOT IN (
    SELECT DISTINCT nit_proveedor FROM compras
);


-- ----------------------------------------------------------------
-- BLOQUE G: JOIN + GROUP BY + HAVING
-- ----------------------------------------------------------------

-- ┌── CONSULTA 34: INNER JOIN — ventas con cliente y empleado ─────
-- │ Tablas      : ventas, clientes, empleados
-- │ Qué hace    : Muestra cada venta con el nombre del cliente y
-- │               del empleado que la atendió.
-- │ Cómo        : INNER JOIN doble: ventas ↔ clientes por
-- │               cedula_cliente y ventas ↔ empleados por
-- │               cedula_empleado.
-- │ Resultado   : Solo las ventas con cliente registrado (excluye
-- │               la venta anónima #8).
-- └────────────────────────────────────────────────────────────────
SELECT v.id_venta,
       c.nombre AS cliente,
       e.nombre AS empleado,
       v.fecha_venta, v.total_venta, v.metodo_pago
FROM ventas v
INNER JOIN clientes  c ON v.cedula_cliente  = c.cedula
INNER JOIN empleados e ON v.cedula_empleado = e.cedula;

-- ┌── CONSULTA 35: LEFT JOIN — todas las ventas (incluye anónimas) ─
-- │ Tablas      : ventas, clientes, empleados
-- │ Qué hace    : Lista TODAS las ventas, incluyendo las realizadas
-- │               sin cliente registrado.
-- │ Cómo        : LEFT JOIN a clientes (NULL si anónima) + COALESCE
-- │               para mostrar 'Cliente Anónimo' cuando el cliente
-- │               es NULL.
-- │ Resultado   : 10 ventas; la venta #8 aparece como
-- │               'Cliente Anónimo'.
-- └────────────────────────────────────────────────────────────────
SELECT v.id_venta,
       COALESCE(c.nombre, 'Cliente Anónimo') AS cliente,
       e.nombre AS empleado,
       v.total_venta, v.metodo_pago
FROM ventas v
LEFT  JOIN clientes  c ON v.cedula_cliente  = c.cedula
INNER JOIN empleados e ON v.cedula_empleado = e.cedula;

-- ┌── CONSULTA 36: LEFT JOIN + IS NULL — clientes sin compras ─────
-- │ Tablas      : clientes, ventas
-- │ Qué hace    : Detecta clientes registrados que no tienen
-- │               ninguna venta asociada.
-- │ Cómo        : LEFT JOIN de clientes a ventas; WHERE id_venta
-- │               IS NULL retiene solo los clientes sin coincidencia.
-- │ Resultado   : Clientes que nunca han comprado — candidatos a
-- │               campañas de activación.
-- └────────────────────────────────────────────────────────────────
SELECT c.cedula, c.nombre, c.email
FROM clientes c
LEFT JOIN ventas v ON c.cedula = v.cedula_cliente
WHERE v.id_venta IS NULL;

-- ┌── CONSULTA 37: GROUP BY — total de compras por proveedor ──────
-- │ Tablas      : proveedores, compras
-- │ Qué hace    : Calcula el total de órdenes de compra realizadas
-- │               con cada proveedor y el monto acumulado.
-- │ Cómo        : JOIN entre proveedores y compras + GROUP BY +
-- │               COUNT y SUM, ORDER BY monto DESC.
-- │ Resultado   : 10 filas con nombre de empresa, cantidad de
-- │               compras y monto total, de mayor a menor.
-- └────────────────────────────────────────────────────────────────
SELECT pr.nombre_empresa,
       COUNT(c.id_compra)   AS total_compras,
       SUM(c.total_compra)  AS monto_total
FROM proveedores pr
JOIN compras c ON pr.nit = c.nit_proveedor
GROUP BY pr.nit, pr.nombre_empresa
ORDER BY monto_total DESC;

-- ┌── CONSULTA 38: GROUP BY — ventas totales por empleado ─────────
-- │ Tablas      : empleados, ventas
-- │ Qué hace    : Mide el desempeño de cada empleado en términos
-- │               de ventas realizadas y monto total vendido.
-- │ Cómo        : JOIN + COUNT(id_venta) + SUM(total_venta)
-- │               agrupados por empleado, ORDER BY total DESC.
-- │ Resultado   : Lista de empleados con cantidad de ventas y
-- │               monto total, ordenada de mayor a menor.
-- └────────────────────────────────────────────────────────────────
SELECT e.nombre, e.cargo,
       COUNT(v.id_venta)   AS cant_ventas,
       SUM(v.total_venta)  AS total_vendido
FROM empleados e
JOIN ventas v ON e.cedula = v.cedula_empleado
GROUP BY e.cedula, e.nombre, e.cargo
ORDER BY total_vendido DESC;

-- ┌── CONSULTA 39: GROUP BY + HAVING — empleados sobre $200.000 ───
-- │ Tablas      : empleados, ventas
-- │ Qué hace    : Filtra solo los empleados cuyas ventas totales
-- │               superan los $200.000.
-- │ Cómo        : Igual que la anterior pero con HAVING
-- │               SUM(total_venta) > 200000.
-- │ Resultado   : Solo los empleados con mayor desempeño de ventas.
-- └────────────────────────────────────────────────────────────────
SELECT e.nombre, e.cargo,
       COUNT(v.id_venta)   AS cant_ventas,
       SUM(v.total_venta)  AS total_vendido
FROM empleados e
JOIN ventas v ON e.cedula = v.cedula_empleado
GROUP BY e.cedula, e.nombre, e.cargo
HAVING SUM(v.total_venta) > 200000
ORDER BY total_vendido DESC;

-- ┌── CONSULTA 40: GROUP BY + HAVING — proveedores con >1 compra ──
-- │ Tablas      : proveedores, compras
-- │ Qué hace    : Filtra los proveedores que han tenido más de una
-- │               orden de compra registrada.
-- │ Cómo        : JOIN + GROUP BY + HAVING COUNT(id_compra) > 1.
-- │ Resultado   : Proveedores con relación comercial frecuente.
-- └────────────────────────────────────────────────────────────────
SELECT pr.nombre_empresa,
       COUNT(c.id_compra)   AS total_compras,
       SUM(c.total_compra)  AS monto_total
FROM proveedores pr
JOIN compras c ON pr.nit = c.nit_proveedor
GROUP BY pr.nit, pr.nombre_empresa
HAVING COUNT(c.id_compra) > 1
ORDER BY monto_total DESC;

-- ┌── CONSULTA 41: JOIN triple + GROUP BY — ingresos por tipo ─────
-- │ Tablas      : productos, detalle_ventas, ventas
-- │ Qué hace    : Calcula el total de unidades vendidas e ingresos
-- │               generados agrupados por tipo de licor.
-- │ Cómo        : JOIN triple enlazando productos → detalle_ventas
-- │               → ventas; WHERE estado = 'Completada'; GROUP BY
-- │               tipo_licor.
-- │ Resultado   : Ranking de ingresos por categoría de licor
-- │               (Whisky, Aguardiente, etc.), ordenado de mayor
-- │               a menor ingreso.
-- └────────────────────────────────────────────────────────────────
SELECT p.tipo_licor,
       SUM(dv.cantidad)  AS unidades_vendidas,
       SUM(dv.subtotal)  AS ingresos_totales
FROM productos p
JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
JOIN ventas v          ON dv.id_venta   = v.id_venta
WHERE v.estado = 'Completada'
GROUP BY p.tipo_licor
ORDER BY ingresos_totales DESC;

-- ┌── CONSULTA 42: GROUP BY + HAVING — clientes con >1 compra ─────
-- │ Tablas      : clientes, ventas
-- │ Qué hace    : Identifica los clientes frecuentes que han
-- │               realizado más de una compra.
-- │ Cómo        : JOIN + GROUP BY + HAVING COUNT(id_venta) > 1.
-- │ Resultado   : Lista de clientes frecuentes con total de
-- │               compras, ordenada de mayor a menor.
-- └────────────────────────────────────────────────────────────────
SELECT c.cedula, c.nombre,
       COUNT(v.id_venta) AS total_compras
FROM clientes c
JOIN ventas v ON c.cedula = v.cedula_cliente
GROUP BY c.cedula, c.nombre
HAVING COUNT(v.id_venta) > 1
ORDER BY total_compras DESC;

-- ┌── CONSULTA 43: GROUP BY + HAVING — promedio de venta > $100.000
-- │ Tablas      : ventas
-- │ Qué hace    : Muestra los métodos de pago cuyo promedio de
-- │               venta supera los $100.000.
-- │ Cómo        : GROUP BY metodo_pago + HAVING AVG(total_venta)
-- │               > 100000.
-- │ Resultado   : Métodos de pago asociados a compras de mayor
-- │               valor promedio (Transferencia, Tarjeta, etc.).
-- └────────────────────────────────────────────────────────────────
SELECT metodo_pago,
       COUNT(*)           AS cantidad,
       AVG(total_venta)   AS promedio_venta
FROM ventas
GROUP BY metodo_pago
HAVING AVG(total_venta) > 100000;


-- ----------------------------------------------------------------
-- BLOQUE H: RIGHT JOIN, CROSS JOIN, NATURAL JOIN, STRAIGHT_JOIN
-- ----------------------------------------------------------------

-- ┌── CONSULTA 44: RIGHT JOIN — todos los productos con sus ventas ─
-- │ Tablas      : detalle_ventas (izquierda), productos (derecha/maestra)
-- │ Qué hace    : Lista todos los productos del catálogo con sus
-- │               datos de ventas, incluyendo los que nunca se vendieron.
-- │ Cómo        : RIGHT JOIN: productos es la tabla maestra (derecha).
-- │               Sin coincidencia en detalle_ventas → columnas NULL.
-- │ Resultado   : 10 productos. Los sin ventas muestran NULL en
-- │               cantidad y subtotal.
-- └────────────────────────────────────────────────────────────────
SELECT p.nombre AS producto, p.tipo_licor, p.stock_actual,
       dv.cantidad, dv.subtotal
FROM detalle_ventas dv
RIGHT JOIN productos p ON dv.id_producto = p.id_producto;

-- ┌── CONSULTA 45: RIGHT JOIN + IS NULL — productos sin ventas ────
-- │ Tablas      : detalle_ventas (izquierda), productos (derecha)
-- │ Qué hace    : Identifica exactamente qué productos del catálogo
-- │               no tienen ninguna venta registrada.
-- │ Cómo        : RIGHT JOIN + WHERE detalle_ventas.id_producto
-- │               IS NULL retiene solo los sin coincidencia.
-- │ Resultado   : Productos con inventario sin movimiento — útil
-- │               para decisiones de retiro o promociones.
-- └────────────────────────────────────────────────────────────────
SELECT p.id_producto, p.nombre, p.tipo_licor, p.stock_actual
FROM detalle_ventas dv
RIGHT JOIN productos p ON dv.id_producto = p.id_producto
WHERE dv.id_producto IS NULL;

-- ┌── CONSULTA 46: RIGHT JOIN — todos los proveedores con compras ──
-- │ Tablas      : compras (izquierda), proveedores (derecha/maestra)
-- │ Qué hace    : Lista todos los proveedores activos incluyendo
-- │               los que aún no tienen órdenes de compra.
-- │ Cómo        : RIGHT JOIN con proveedores como tabla maestra.
-- │               Los sin compras muestran NULL en id_compra, etc.
-- │ Resultado   : 10 proveedores; los sin compras aparecen con
-- │               NULL en las columnas de la tabla compras.
-- └────────────────────────────────────────────────────────────────
SELECT pr.nombre_empresa, pr.persona_contacto,
       c.id_compra, c.fecha_compra, c.total_compra
FROM compras c
RIGHT JOIN proveedores pr ON c.nit_proveedor = pr.nit;

-- ┌── CONSULTA 47: CROSS JOIN — combinaciones producto × método ───
-- │ Tablas      : productos, ventas
-- │ Qué hace    : Genera todas las combinaciones posibles entre
-- │               los productos del catálogo y los métodos de pago.
-- │ Cómo        : CROSS JOIN produce el producto cartesiano completo
-- │               (10 productos × N ventas). GROUP BY agrupa las
-- │               combinaciones repetidas para mostrar pares únicos.
-- │ Resultado   : Lista de pares (producto, método de pago) que
-- │               han coexistido en ventas reales de la licorería.
-- └────────────────────────────────────────────────────────────────
SELECT p.nombre AS producto, p.precio_venta, v.metodo_pago
FROM productos p
CROSS JOIN ventas v
GROUP BY p.id_producto, v.metodo_pago
ORDER BY p.nombre, v.metodo_pago;

-- ┌── CONSULTA 48: NATURAL JOIN — detalle de ventas con encabezado ─
-- │ Tablas      : detalle_ventas, ventas
-- │ Qué hace    : Combina cada detalle de venta con los datos de
-- │               su encabezado sin escribir la condición ON.
-- │ Cómo        : NATURAL JOIN detecta automáticamente el campo
-- │               id_venta que ambas tablas tienen en común y lo
-- │               usa como condición de unión.
-- │ Resultado   : Registros combinados con datos de detalle
-- │               (cantidad, subtotal) más datos del encabezado
-- │               (total_venta, metodo_pago, estado).
-- └────────────────────────────────────────────────────────────────
SELECT id_venta, id_producto, cantidad, precio_unitario,
       subtotal, total_venta, metodo_pago, estado
FROM detalle_ventas
NATURAL JOIN ventas;

-- ┌── CONSULTA 49: STRAIGHT_JOIN — productos con ventas (orden forzado)
-- │ Tablas      : productos (izq. — se procesa primero),
-- │               detalle_ventas (derecha)
-- │ Qué hace    : Obtiene productos con sus ventas garantizando que
-- │               el motor lea primero la tabla izquierda.
-- │ Cómo        : STRAIGHT_JOIN instruye al optimizador de MariaDB
-- │               a procesar la tabla izquierda antes que la derecha,
-- │               sin alterar el resultado final.
-- │ Resultado   : Idéntico a un INNER JOIN; la diferencia está en
-- │               el plan de ejecución interno garantizado.
-- └────────────────────────────────────────────────────────────────
SELECT p.nombre AS producto, p.tipo_licor,
       dv.cantidad, dv.subtotal
FROM productos p
STRAIGHT_JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
ORDER BY dv.subtotal DESC;


-- ----------------------------------------------------------------
-- BLOQUE I: VARIABLES DE USUARIO
-- ----------------------------------------------------------------

-- ┌── CONSULTAS 50-51: @menorprecio — producto más económico ──────
-- │ Tablas      : productos
-- │ Qué hace    : Almacena el precio de venta mínimo y luego
-- │               recupera todos los datos del producto más barato.
-- │ Cómo        : Consulta 1: SELECT @menorprecio := MIN(precio_venta)
-- │               guarda el mínimo en la variable. Consulta 2:
-- │               WHERE precio_venta = @menorprecio usa la variable.
-- │ Resultado   : @menorprecio = 2000. Segunda consulta devuelve
-- │               todos los datos de la Cerveza Poker Lata.
-- └────────────────────────────────────────────────────────────────
SELECT @menorprecio := MIN(precio_venta) FROM productos;

SELECT * FROM productos
WHERE precio_venta = @menorprecio;

-- ┌── CONSULTA 52: @mayorprecio — producto más costoso ────────────
-- │ Tablas      : productos
-- │ Qué hace    : Identifica el producto con el mayor precio de
-- │               venta del catálogo.
-- │ Cómo        : SELECT @mayorprecio := MAX(precio_venta) guarda
-- │               el máximo; WHERE precio_venta = @mayorprecio filtra.
-- │ Resultado   : @mayorprecio = 170000. Devuelve el Ron Santa
-- │               Teresa 1796 con su tipo, categoría y precio.
-- └────────────────────────────────────────────────────────────────
SELECT @mayorprecio := MAX(precio_venta) FROM productos;

SELECT nombre, tipo_licor, categoria, precio_venta
FROM productos
WHERE precio_venta = @mayorprecio;

-- ┌── CONSULTA 53: @nit_proveedor — proveedor del producto más caro
-- │ Tablas      : detalle_compras, compras, productos, proveedores
-- │ Qué hace    : Determina qué proveedor suministró el producto
-- │               con el mayor precio de compra.
-- │ Cómo        : JOIN triple filtrando precio_compra = MAX;
-- │               el NIT se guarda en @nit_proveedor y se usa en
-- │               el SELECT de proveedores.
-- │ Resultado   : Datos completos del proveedor del Ron Santa
-- │               Teresa 1796 (precio_compra = $120.000).
-- └────────────────────────────────────────────────────────────────
SELECT @nit_proveedor := dc.nit_proveedor
FROM detalle_compras dco
JOIN compras dc ON dco.id_compra = dc.id_compra
JOIN productos p  ON dco.id_producto = p.id_producto
WHERE p.precio_compra = (SELECT MAX(precio_compra) FROM productos)
LIMIT 1;

SELECT nombre_empresa, persona_contacto, telefono
FROM proveedores
WHERE nit = @nit_proveedor;

-- ┌── CONSULTA 54: @top_cedula — empleado con más ventas ──────────
-- │ Tablas      : ventas, empleados
-- │ Qué hace    : Identifica y muestra los datos completos del
-- │               empleado con mayor número de ventas registradas.
-- │ Cómo        : Consulta 1: GROUP BY + ORDER BY COUNT(*) DESC +
-- │               LIMIT 1 guarda la cédula en @top_cedula.
-- │               Consulta 2: SELECT * FROM empleados filtra por ella.
-- │ Resultado   : @top_cedula = 43219876. Devuelve los datos de
-- │               Laura Martínez Pérez (Vendedora, 3 ventas).
-- └────────────────────────────────────────────────────────────────
SELECT @top_cedula := cedula_empleado
FROM ventas
GROUP BY cedula_empleado
ORDER BY COUNT(*) DESC
LIMIT 1;

SELECT cedula, nombre, cargo, salario
FROM empleados
WHERE cedula = @top_cedula;


-- ================================================================
-- BLOQUE J: ENCRIPTACIÓN
-- Funciones de hashing disponibles en MariaDB:
--   · SHA1()      → hash de 160 bits → 40 caracteres hex (irreversible)
--   · MD5()       → hash de 128 bits → 32 caracteres hex (irreversible)
--   · PASSWORD()  → hash interno de MariaDB para contraseñas del sistema
--
-- Concepto clave: los hashes son IRREVERSIBLES. Para verificar una
-- contraseña se vuelve a hashear el valor ingresado y se compara
-- con el hash almacenado.
-- ================================================================

-- ┌── CONSULTA 55: SHA1 y MD5 — ver cómo lucen los hashes ─────────
-- │ Tablas      : (ninguna — funciones sobre valores literales)
-- │ Qué hace    : Muestra el resultado de aplicar SHA1 y MD5 a una
-- │               misma cadena para comparar longitud y formato.
-- │ Cómo        : SELECT SHA1('texto') y SELECT MD5('texto').
-- │ Resultado   : SHA1 → 40 chars hex | MD5 → 32 chars hex.
-- │               Ambos son irreversibles: no se puede recuperar
-- │               el texto original a partir del hash.
-- └────────────────────────────────────────────────────────────────
SELECT SHA1('Abc123') AS hash_sha1_40chars;
SELECT MD5('Abc123')  AS hash_md5_32chars;
SELECT PASSWORD('Abc123') AS hash_password_sistema;

-- ┌── CONSULTA 56: Crear tabla de usuarios con contraseñas cifradas ─
-- │ Tablas      : usuarios_licoreria (nueva tabla)
-- │ Qué hace    : Crea una tabla para gestionar el acceso al sistema
-- │               de la licorería. La clave se almacena como hash,
-- │               nunca como texto plano.
-- │ Cómo        : CREATE TABLE con columna Clave VARCHAR(40) —
-- │               tamaño suficiente para SHA1 (40 chars) y MD5 (32).
-- │ Resultado   : Nueva tabla lista para almacenar credenciales
-- │               cifradas de los usuarios del sistema.
-- └────────────────────────────────────────────────────────────────
CREATE TABLE `usuarios_licoreria` (
  `id`      VARCHAR(5)  NOT NULL,
  `usuario` VARCHAR(20) NOT NULL,
  `clave`   VARCHAR(41) NOT NULL,
  `estado`  VARCHAR(5)  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ┌── CONSULTA 57: Insertar usuarios con distintos algoritmos ──────
-- │ Tablas      : usuarios_licoreria
-- │ Qué hace    : Registra tres usuarios aplicando un algoritmo
-- │               de hash diferente a cada contraseña para demostrar
-- │               las distintas funciones de encriptación.
-- │ Cómo        : INSERT usando SHA1(), MD5() y PASSWORD() dentro
-- │               de los VALUES para cifrar la clave al insertar.
-- │ Resultado   : 3 registros con la misma clave 'Abc123' pero
-- │               representada con tres hashes distintos.
-- └────────────────────────────────────────────────────────────────
INSERT INTO usuarios_licoreria VALUES ('00001', 'gerente',   SHA1('Abc123'),     'A');
INSERT INTO usuarios_licoreria VALUES ('00002', 'vendedor',  MD5('Abc123'),      'A');
INSERT INTO usuarios_licoreria VALUES ('00003', 'cajero',    PASSWORD('Abc123'), 'A');

-- Ver cómo quedaron almacenadas las claves cifradas
SELECT * FROM usuarios_licoreria;

-- ┌── CONSULTA 58: Verificar login con SHA1 ────────────────────────
-- │ Tablas      : usuarios_licoreria
-- │ Qué hace    : Simula el inicio de sesión del usuario 'gerente'.
-- │               Hashea la clave ingresada y la compara con la
-- │               almacenada — sin necesidad de conocer el texto plano.
-- │ Cómo        : WHERE usuario = 'gerente' AND clave = SHA1('Abc123').
-- │               Si el hash coincide, el usuario existe y la clave
-- │               es correcta → devuelve el registro.
-- │ Resultado   : Devuelve el registro del gerente.
-- │               Si la clave fuera incorrecta, resultado vacío.
-- └────────────────────────────────────────────────────────────────
SELECT usuario, clave
FROM usuarios_licoreria
WHERE usuario = 'gerente' AND clave = SHA1('Abc123');

-- ┌── CONSULTA 59: Verificar login con MD5 ─────────────────────────
-- │ Tablas      : usuarios_licoreria
-- │ Qué hace    : Simula el inicio de sesión del usuario 'vendedor'
-- │               cuya clave fue guardada con MD5.
-- │ Cómo        : WHERE usuario = 'vendedor' AND clave = MD5('Abc123').
-- │ Resultado   : Devuelve el registro del vendedor si la clave
-- │               es correcta. MD5 produce 32 chars hex.
-- └────────────────────────────────────────────────────────────────
SELECT usuario, clave
FROM usuarios_licoreria
WHERE usuario = 'vendedor' AND clave = MD5('Abc123');

-- ┌── CONSULTA 60: Clave incorrecta — resultado vacío ──────────────
-- │ Tablas      : usuarios_licoreria
-- │ Qué hace    : Demuestra qué pasa cuando la clave es incorrecta.
-- │               SHA1('XYZ999') produce un hash diferente al
-- │               almacenado, por lo que no hay coincidencia.
-- │ Cómo        : Misma consulta de login pero con clave errónea.
-- │ Resultado   : Empty set — acceso denegado.
-- └────────────────────────────────────────────────────────────────
SELECT usuario, clave
FROM usuarios_licoreria
WHERE usuario = 'gerente' AND clave = SHA1('XYZ999');

-- ┌── CONSULTA 61: Comparar los tres algoritmos lado a lado ────────
-- │ Tablas      : (ninguna — comparación de funciones)
-- │ Qué hace    : Muestra los tres hashes de la misma cadena
-- │               para evidenciar la diferencia de longitud y formato
-- │               entre SHA1, MD5 y PASSWORD.
-- │ Cómo        : UNION ALL de tres SELECT con cada función.
-- │ Resultado   : SHA1 → 40 chars | MD5 → 32 chars | PASSWORD → 41 chars.
-- └────────────────────────────────────────────────────────────────
SELECT 'SHA1'     AS algoritmo, SHA1('Abc123')     AS hash_resultado, LENGTH(SHA1('Abc123'))     AS longitud
UNION ALL
SELECT 'MD5',                   MD5('Abc123'),                        LENGTH(MD5('Abc123'))
UNION ALL
SELECT 'PASSWORD',              PASSWORD('Abc123'),                   LENGTH(PASSWORD('Abc123'));

-- ┌── CONSULTA 62: Ver todos los usuarios con su algoritmo ─────────
-- │ Tablas      : usuarios_licoreria
-- │ Qué hace    : Lista todos los usuarios del sistema mostrando
-- │               el algoritmo usado según la longitud de la clave.
-- │ Cómo        : CASE + LENGTH(clave) para identificar el algoritmo
-- │               a partir del número de caracteres del hash.
-- │ Resultado   : Cada usuario con su clave cifrada y el nombre
-- │               del algoritmo que se usó para cifrarla.
-- └────────────────────────────────────────────────────────────────
SELECT usuario, clave, estado,
       CASE LENGTH(clave)
           WHEN 40 THEN 'SHA1'
           WHEN 32 THEN 'MD5'
           ELSE         'PASSWORD()'
       END AS algoritmo_usado
FROM usuarios_licoreria;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- ================================================================
-- FIN DEL SCRIPT  |  licoreria_COMPLETO.sql
-- 62 consultas numeradas | 10 bloques | 14 tablas
-- ================================================================
