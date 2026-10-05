-- ============================================================
-- 003_demo_seed.sql — Datos demo para presentación a cliente
-- Ejecutar DESPUÉS de 001_initial.sql y 002_seed_catalog.sql
-- ============================================================

-- ── 1. EMPLEADOS ─────────────────────────────────────────────
-- 3 puntos de venta en Bucaramanga:
--   CC. Parque Caracolí Piso 3  → María Fernanda Rojas, Carlos Martínez
--   CC. El Cacique Piso 2 L245  → Alejandro Vargas, Laura Ospina
--   Sede Cabecera Cra 31 #51-32 → Valentina Díaz
--   Gerencia                    → Jorge Peña (admin)

INSERT INTO users (id,email,password_hash,first_name,last_name,phone,role,zoho_contact_id,created_at,last_login_at) VALUES
('a0000000-0000-0000-0000-000000000001','jorge.pena@esenzzia.com',   '$2b$10$DEMO.HASH.ADMIN.JORGE.1','Jorge',          'Peña',     '3001234567','admin','ZC-EMP-001',NOW()-INTERVAL'365 days',NOW()-INTERVAL'30 minutes'),
('a0000000-0000-0000-0000-000000000002','mafe.rojas@esenzzia.com',   '$2b$10$DEMO.HASH.STAFF.MAFE..2','María Fernanda', 'Rojas',    '3112345678','staff','ZC-EMP-002',NOW()-INTERVAL'300 days',NOW()-INTERVAL'2 hours'),
('a0000000-0000-0000-0000-000000000003','alex.vargas@esenzzia.com',  '$2b$10$DEMO.HASH.STAFF.ALEX..3','Alejandro',      'Vargas',   '3123456789','staff','ZC-EMP-003',NOW()-INTERVAL'280 days',NOW()-INTERVAL'3 hours'),
('a0000000-0000-0000-0000-000000000004','valen.diaz@esenzzia.com',   '$2b$10$DEMO.HASH.STAFF.VALE..4','Valentina',      'Díaz',     '3134567890','staff','ZC-EMP-004',NOW()-INTERVAL'240 days',NOW()-INTERVAL'5 hours'),
('a0000000-0000-0000-0000-000000000005','carlos.martinez@esenzzia.com','$2b$10$DEMO.HASH.STAFF.CARL5','Carlos',         'Martínez', '3145678901','staff','ZC-EMP-005',NOW()-INTERVAL'180 days',NOW()-INTERVAL'1 day'),
('a0000000-0000-0000-0000-000000000006','laura.ospina@esenzzia.com', '$2b$10$DEMO.HASH.STAFF.LAUR.6','Laura',           'Ospina',   '3156789012','staff','ZC-EMP-006',NOW()-INTERVAL'150 days',NOW()-INTERVAL'2 days')
ON CONFLICT (email) DO NOTHING;

-- ── 2. CLIENTES ───────────────────────────────────────────────
INSERT INTO users (id,email,password_hash,first_name,last_name,phone,role,zoho_contact_id,zoho_customer_id,created_at,last_login_at) VALUES
('c0000000-0000-0000-0000-000000000001','ana.moreno@gmail.com',        '$2b$10$DEMO.HASH.CUST.01','Ana Sofía',    'Moreno',   '3201234567','customer','ZC-CUST-001','ZB-CUST-001',NOW()-INTERVAL'120 days',NOW()-INTERVAL'5 days'),
('c0000000-0000-0000-0000-000000000002','juan.prada@hotmail.com',      '$2b$10$DEMO.HASH.CUST.02','Juan David',   'Prada',    '3212345678','customer','ZC-CUST-002','ZB-CUST-002',NOW()-INTERVAL'110 days',NOW()-INTERVAL'3 days'),
('c0000000-0000-0000-0000-000000000003','camila.rios@gmail.com',       '$2b$10$DEMO.HASH.CUST.03','Camila',       'Ríos',     '3223456789','customer','ZC-CUST-003','ZB-CUST-003',NOW()-INTERVAL'105 days',NOW()-INTERVAL'10 days'),
('c0000000-0000-0000-0000-000000000004','luisfer.mendez@gmail.com',    '$2b$10$DEMO.HASH.CUST.04','Luis Fernando','Méndez',   '3234567890','customer','ZC-CUST-004','ZB-CUST-004',NOW()-INTERVAL'100 days',NOW()-INTERVAL'15 days'),
('c0000000-0000-0000-0000-000000000005','paola.suarez@yahoo.com',      '$2b$10$DEMO.HASH.CUST.05','Paola Andrea', 'Suárez',   '3245678901','customer','ZC-CUST-005','ZB-CUST-005',NOW()-INTERVAL'95 days', NOW()-INTERVAL'4 days'),
('c0000000-0000-0000-0000-000000000006','andres.gomez@gmail.com',      '$2b$10$DEMO.HASH.CUST.06','Andrés Felipe','Gómez',    '3256789012','customer','ZC-CUST-006','ZB-CUST-006',NOW()-INTERVAL'92 days', NOW()-INTERVAL'8 days'),
('c0000000-0000-0000-0000-000000000007','diana.herrera@gmail.com',     '$2b$10$DEMO.HASH.CUST.07','Diana Marcela','Herrera',  '3267890123','customer','ZC-CUST-007','ZB-CUST-007',NOW()-INTERVAL'88 days', NOW()-INTERVAL'6 days'),
('c0000000-0000-0000-0000-000000000008','sebas.torres@gmail.com',      '$2b$10$DEMO.HASH.CUST.08','Sebastián',    'Torres',   '3278901234','customer','ZC-CUST-008','ZB-CUST-008',NOW()-INTERVAL'85 days', NOW()-INTERVAL'7 days'),
('c0000000-0000-0000-0000-000000000009','isabella.ramirez@gmail.com',  '$2b$10$DEMO.HASH.CUST.09','Isabella',     'Ramírez',  '3289012345','customer','ZC-CUST-009','ZB-CUST-009',NOW()-INTERVAL'80 days', NOW()-INTERVAL'12 days'),
('c0000000-0000-0000-0000-000000000010','miguel.castro@gmail.com',     '$2b$10$DEMO.HASH.CUST.10','Miguel Ángel', 'Castro',   '3290123456','customer','ZC-CUST-010','ZB-CUST-010',NOW()-INTERVAL'75 days', NOW()-INTERVAL'20 days'),
('c0000000-0000-0000-0000-000000000011','valen.nino@gmail.com',        '$2b$10$DEMO.HASH.CUST.11','Valentina',    'Niño',     '3201234568','customer','ZC-CUST-011','ZB-CUST-011',NOW()-INTERVAL'72 days', NOW()-INTERVAL'11 days'),
('c0000000-0000-0000-0000-000000000012','daniel.estrada@hotmail.com',  '$2b$10$DEMO.HASH.CUST.12','Daniel',       'Estrada',  '3212345679','customer','ZC-CUST-012','ZB-CUST-012',NOW()-INTERVAL'70 days', NOW()-INTERVAL'18 days'),
('c0000000-0000-0000-0000-000000000013','natalia.rueda@gmail.com',     '$2b$10$DEMO.HASH.CUST.13','Natalia',      'Rueda',    '3223456780','customer','ZC-CUST-013','ZB-CUST-013',NOW()-INTERVAL'65 days', NOW()-INTERVAL'9 days'),
('c0000000-0000-0000-0000-000000000014','cristian.vargas@gmail.com',   '$2b$10$DEMO.HASH.CUST.14','Cristian',     'Vargas',   '3234567891','customer','ZC-CUST-014','ZB-CUST-014',NOW()-INTERVAL'60 days', NOW()-INTERVAL'22 days'),
('c0000000-0000-0000-0000-000000000015','mariana.alvarez@gmail.com',   '$2b$10$DEMO.HASH.CUST.15','Mariana',      'Álvarez',  '3245678902','customer','ZC-CUST-015','ZB-CUST-015',NOW()-INTERVAL'55 days', NOW()-INTERVAL'14 days'),
('c0000000-0000-0000-0000-000000000016','felipe.cardenas@gmail.com',   '$2b$10$DEMO.HASH.CUST.16','Felipe',       'Cárdenas', '3256789013','customer','ZC-CUST-016','ZB-CUST-016',NOW()-INTERVAL'50 days', NOW()-INTERVAL'2 days'),
('c0000000-0000-0000-0000-000000000017','laura.delgado@gmail.com',     '$2b$10$DEMO.HASH.CUST.17','Laura',        'Delgado',  '3267890124','customer','ZC-CUST-017','ZB-CUST-017',NOW()-INTERVAL'45 days', NOW()-INTERVAL'16 days'),
('c0000000-0000-0000-0000-000000000018','roberto.silva@gmail.com',     '$2b$10$DEMO.HASH.CUST.18','Roberto',      'Silva',    '3278901235','customer','ZC-CUST-018','ZB-CUST-018',NOW()-INTERVAL'42 days', NOW()-INTERVAL'1 day')
ON CONFLICT (email) DO NOTHING;

-- ── 3. DIRECCIONES (Bucaramanga) ──────────────────────────────
INSERT INTO addresses (user_id,label,line1,city,state,is_default) VALUES
('c0000000-0000-0000-0000-000000000001','Casa','Cra 35 # 48-22, Cabecera del Llano',       'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000002','Casa','Cll 48 # 27-15, Barrio Sotomayor',          'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000003','Casa','Cra 22 # 55-30, El Poblado',                'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000004','Casa','Cll 52 # 30-18, Lagos del Cacique',         'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000005','Casa','Cra 33 # 51-07, Barrio Jardín',             'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000006','Casa','Cll 56 # 24-11, La Concordia',              'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000007','Casa','Cra 19 # 37-45, Antonia Santos',            'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000008','Casa','Cll 45 # 31-22, Barrio Provenza',           'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000009','Casa','Cra 27 # 43-16, La Aurora',                 'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000010','Casa','Cll 60 # 23-08, Barrio Álamos',             'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000011','Casa','Cra 29 # 50-33, Mejoras Públicas',          'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000012','Casa','Cll 47 # 28-19, La Florida',                'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000013','Casa','Cra 36 # 46-05, Barrio Recreo',             'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000014','Casa','Cll 53 # 32-22, Villaluz',                  'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000015','Casa','Cra 24 # 58-11, Prados del Norte',          'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000016','Casa','Cll 49 # 25-07, El Bosque',                 'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000017','Casa','Cra 31 # 44-28, Ciudad Jardín',             'Bucaramanga','Santander',TRUE),
('c0000000-0000-0000-0000-000000000018','Casa','Cll 55 # 33-14, Barrio Tejar',              'Bucaramanga','Santander',TRUE);

-- ── 4. INVENTARIO — stock bajo en best-sellers (alertas demo) ─
UPDATE product_variants SET stock = 3  WHERE sku = 'ESZ-001-100ML'; -- Acqua di Gio   CRÍTICO
UPDATE product_variants SET stock = 2  WHERE sku = 'ESZ-004-100ML'; -- Arabians Tonka CRÍTICO
UPDATE product_variants SET stock = 4  WHERE sku = 'ESZ-016-100ML'; -- Good Girl       BAJO
UPDATE product_variants SET stock = 6  WHERE sku = 'ESZ-003-100ML'; -- 9PM             BAJO
UPDATE product_variants SET stock = 8  WHERE sku = 'ESZ-006-100ML'; -- Bad Boy         OK
UPDATE product_variants SET stock = 12 WHERE sku = 'ESZ-005-100ML'; -- La Vie Est Belle OK
UPDATE product_variants SET stock = 15 WHERE sku = 'ESZ-017-100ML'; -- Invictus        OK
UPDATE product_variants SET stock = 18 WHERE sku = 'ESZ-015-100ML'; -- Phantom         OK

-- ── 5. CUPONES ────────────────────────────────────────────────
INSERT INTO coupons (id,code,type,value,min_order_total,max_uses,uses,is_active,expires_at) VALUES
('f0000000-0000-0000-0000-000000000001','BIENVENIDO10','percent',10, 50000,200,47,TRUE,NOW()+INTERVAL'90 days'),
('f0000000-0000-0000-0000-000000000002','ESENZ15',     'percent',15,150000,100,23,TRUE,NOW()+INTERVAL'60 days'),
('f0000000-0000-0000-0000-000000000003','ANIVERSARIO20','percent',20,200000, 50,18,TRUE,NOW()+INTERVAL'30 days'),
('f0000000-0000-0000-0000-000000000004','VIP25',       'percent',25,300000,  10, 3,TRUE,NOW()+INTERVAL'180 days')
ON CONFLICT (code) DO NOTHING;

-- ── 6. ÓRDENES (42 total) ─────────────────────────────────────
-- Ingresos demostrativos:
--   Julio   → $1.24M COP  (6 entregadas)
--   Agosto  → $1.95M COP  (11 entregadas + 1 cancelada)
--   Septiembre → $2.22M COP (10 entregadas)
--   Octubre (pipeline) → $3.03M COP (6 enviadas + 4 proc + 3 conf + 1 pend)

INSERT INTO orders (id,order_number,user_id,status,subtotal,discount,shipping,tax,total,currency,shipping_address,zoho_salesorder_id,zoho_invoice_id,created_at,updated_at) VALUES

-- JULIO ──────────────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000001','ESZ-20260714-001','c0000000-0000-0000-0000-000000000001','delivered',189000,0,8000,0,197000,'COP',
 '{"full_name":"Ana Sofía Moreno","line1":"Cra 35 # 48-22","city":"Bucaramanga","phone":"3201234567"}','ZSO-2026-001','ZI-2026-001',NOW()-INTERVAL'83 days',NOW()-INTERVAL'76 days'),

('e0000000-0000-0000-0000-000000000002','ESZ-20260717-002','c0000000-0000-0000-0000-000000000002','delivered',210000,0,0,0,210000,'COP',
 '{"full_name":"Juan David Prada","line1":"Cll 48 # 27-15","city":"Bucaramanga","phone":"3212345678"}','ZSO-2026-002','ZI-2026-002',NOW()-INTERVAL'80 days',NOW()-INTERVAL'73 days'),

('e0000000-0000-0000-0000-000000000003','ESZ-20260721-003','c0000000-0000-0000-0000-000000000003','delivered',225000,0,0,0,225000,'COP',
 '{"full_name":"Camila Ríos","line1":"Cra 22 # 55-30","city":"Bucaramanga","phone":"3223456789"}','ZSO-2026-003','ZI-2026-003',NOW()-INTERVAL'76 days',NOW()-INTERVAL'70 days'),

('e0000000-0000-0000-0000-000000000004','ESZ-20260724-004','c0000000-0000-0000-0000-000000000004','delivered',200000,0,0,0,200000,'COP',
 '{"full_name":"Luis Fernando Méndez","line1":"Cll 52 # 30-18","city":"Bucaramanga","phone":"3234567890"}','ZSO-2026-004','ZI-2026-004',NOW()-INTERVAL'73 days',NOW()-INTERVAL'67 days'),

('e0000000-0000-0000-0000-000000000005','ESZ-20260728-005','c0000000-0000-0000-0000-000000000005','delivered',220000,0,0,0,220000,'COP',
 '{"full_name":"Paola Andrea Suárez","line1":"Cra 33 # 51-07","city":"Bucaramanga","phone":"3245678901"}','ZSO-2026-005','ZI-2026-005',NOW()-INTERVAL'69 days',NOW()-INTERVAL'63 days'),

('e0000000-0000-0000-0000-000000000006','ESZ-20260731-006','c0000000-0000-0000-0000-000000000006','delivered',180000,0,8000,0,188000,'COP',
 '{"full_name":"Andrés Felipe Gómez","line1":"Cll 56 # 24-11","city":"Bucaramanga","phone":"3256789012"}','ZSO-2026-006','ZI-2026-006',NOW()-INTERVAL'66 days',NOW()-INTERVAL'60 days'),

-- AGOSTO ─────────────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000007','ESZ-20260804-007','c0000000-0000-0000-0000-000000000007','delivered',225000,0,0,0,225000,'COP',
 '{"full_name":"Diana Marcela Herrera","line1":"Cra 19 # 37-45","city":"Bucaramanga","phone":"3267890123"}','ZSO-2026-007','ZI-2026-007',NOW()-INTERVAL'63 days',NOW()-INTERVAL'57 days'),

('e0000000-0000-0000-0000-000000000008','ESZ-20260807-008','c0000000-0000-0000-0000-000000000001','delivered',225000,0,0,0,225000,'COP',
 '{"full_name":"Ana Sofía Moreno","line1":"Cra 35 # 48-22","city":"Bucaramanga","phone":"3201234567"}','ZSO-2026-008','ZI-2026-008',NOW()-INTERVAL'60 days',NOW()-INTERVAL'54 days'),

('e0000000-0000-0000-0000-000000000009','ESZ-20260810-009','c0000000-0000-0000-0000-000000000008','delivered',195000,0,8000,0,203000,'COP',
 '{"full_name":"Sebastián Torres","line1":"Cll 45 # 31-22","city":"Bucaramanga","phone":"3278901234"}','ZSO-2026-009','ZI-2026-009',NOW()-INTERVAL'57 days',NOW()-INTERVAL'51 days'),

('e0000000-0000-0000-0000-000000000010','ESZ-20260813-010','c0000000-0000-0000-0000-000000000009','delivered',120000,0,8000,0,128000,'COP',
 '{"full_name":"Isabella Ramírez","line1":"Cra 27 # 43-16","city":"Bucaramanga","phone":"3289012345"}','ZSO-2026-010','ZI-2026-010',NOW()-INTERVAL'54 days',NOW()-INTERVAL'48 days'),

('e0000000-0000-0000-0000-000000000011','ESZ-20260816-011','c0000000-0000-0000-0000-000000000010','delivered',165000,0,8000,0,173000,'COP',
 '{"full_name":"Miguel Ángel Castro","line1":"Cll 60 # 23-08","city":"Bucaramanga","phone":"3290123456"}','ZSO-2026-011','ZI-2026-011',NOW()-INTERVAL'51 days',NOW()-INTERVAL'45 days'),

('e0000000-0000-0000-0000-000000000012','ESZ-20260819-012','c0000000-0000-0000-0000-000000000011','delivered',165000,0,8000,0,173000,'COP',
 '{"full_name":"Valentina Niño","line1":"Cra 29 # 50-33","city":"Bucaramanga","phone":"3201234568"}','ZSO-2026-012','ZI-2026-012',NOW()-INTERVAL'48 days',NOW()-INTERVAL'42 days'),

('e0000000-0000-0000-0000-000000000013','ESZ-20260822-013','c0000000-0000-0000-0000-000000000002','delivered',132300,0,8000,0,140300,'COP',
 '{"full_name":"Juan David Prada","line1":"Cll 48 # 27-15","city":"Bucaramanga","phone":"3212345678"}','ZSO-2026-013','ZI-2026-013',NOW()-INTERVAL'45 days',NOW()-INTERVAL'39 days'),

('e0000000-0000-0000-0000-000000000014','ESZ-20260825-014','c0000000-0000-0000-0000-000000000012','delivered',280000,0,0,0,280000,'COP',
 '{"full_name":"Daniel Estrada","line1":"Cll 47 # 28-19","city":"Bucaramanga","phone":"3212345679"}','ZSO-2026-014','ZI-2026-014',NOW()-INTERVAL'42 days',NOW()-INTERVAL'36 days'),

('e0000000-0000-0000-0000-000000000015','ESZ-20260827-015','c0000000-0000-0000-0000-000000000013','delivered',175000,0,8000,0,183000,'COP',
 '{"full_name":"Natalia Rueda","line1":"Cra 36 # 46-05","city":"Bucaramanga","phone":"3223456780"}','ZSO-2026-015','ZI-2026-015',NOW()-INTERVAL'40 days',NOW()-INTERVAL'34 days'),

('e0000000-0000-0000-0000-000000000016','ESZ-20260830-016','c0000000-0000-0000-0000-000000000001','delivered',253000,38000,0,0,215000,'COP',
 '{"full_name":"Ana Sofía Moreno","line1":"Cra 35 # 48-22","city":"Bucaramanga","phone":"3201234567"}','ZSO-2026-016','ZI-2026-016',NOW()-INTERVAL'37 days',NOW()-INTERVAL'31 days'),

('e0000000-0000-0000-0000-000000000017','ESZ-20260811-017','c0000000-0000-0000-0000-000000000004','cancelled',165000,0,8000,0,173000,'COP',
 '{"full_name":"Luis Fernando Méndez","line1":"Cll 52 # 30-18","city":"Bucaramanga","phone":"3234567890"}',NULL,NULL,NOW()-INTERVAL'56 days',NOW()-INTERVAL'55 days'),

-- SEPTIEMBRE ──────────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000018','ESZ-20260902-018','c0000000-0000-0000-0000-000000000014','delivered',210000,0,0,0,210000,'COP',
 '{"full_name":"Cristian Vargas","line1":"Cll 53 # 32-22","city":"Bucaramanga","phone":"3234567891"}','ZSO-2026-018','ZI-2026-018',NOW()-INTERVAL'33 days',NOW()-INTERVAL'27 days'),

('e0000000-0000-0000-0000-000000000019','ESZ-20260905-019','c0000000-0000-0000-0000-000000000015','delivered',220000,0,0,0,220000,'COP',
 '{"full_name":"Mariana Álvarez","line1":"Cra 24 # 58-11","city":"Bucaramanga","phone":"3245678902"}','ZSO-2026-019','ZI-2026-019',NOW()-INTERVAL'30 days',NOW()-INTERVAL'24 days'),

('e0000000-0000-0000-0000-000000000020','ESZ-20260908-020','c0000000-0000-0000-0000-000000000016','delivered',200000,0,0,0,200000,'COP',
 '{"full_name":"Felipe Cárdenas","line1":"Cll 49 # 25-07","city":"Bucaramanga","phone":"3256789013"}','ZSO-2026-020','ZI-2026-020',NOW()-INTERVAL'27 days',NOW()-INTERVAL'21 days'),

('e0000000-0000-0000-0000-000000000021','ESZ-20260911-021','c0000000-0000-0000-0000-000000000017','delivered',189000,0,8000,0,197000,'COP',
 '{"full_name":"Laura Delgado","line1":"Cra 31 # 44-28","city":"Bucaramanga","phone":"3267890124"}','ZSO-2026-021','ZI-2026-021',NOW()-INTERVAL'24 days',NOW()-INTERVAL'18 days'),

('e0000000-0000-0000-0000-000000000022','ESZ-20260914-022','c0000000-0000-0000-0000-000000000018','delivered',95000,9500,8000,0,93500,'COP',
 '{"full_name":"Roberto Silva","line1":"Cll 55 # 33-14","city":"Bucaramanga","phone":"3278901235"}','ZSO-2026-022','ZI-2026-022',NOW()-INTERVAL'21 days',NOW()-INTERVAL'15 days'),

('e0000000-0000-0000-0000-000000000023','ESZ-20260917-023','c0000000-0000-0000-0000-000000000005','delivered',225000,0,0,0,225000,'COP',
 '{"full_name":"Paola Andrea Suárez","line1":"Cra 33 # 51-07","city":"Bucaramanga","phone":"3245678901"}','ZSO-2026-023','ZI-2026-023',NOW()-INTERVAL'18 days',NOW()-INTERVAL'12 days'),

('e0000000-0000-0000-0000-000000000024','ESZ-20260919-024','c0000000-0000-0000-0000-000000000003','delivered',195000,0,8000,0,203000,'COP',
 '{"full_name":"Camila Ríos","line1":"Cra 22 # 55-30","city":"Bucaramanga","phone":"3223456789"}','ZSO-2026-024','ZI-2026-024',NOW()-INTERVAL'16 days',NOW()-INTERVAL'10 days'),

('e0000000-0000-0000-0000-000000000025','ESZ-20260922-025','c0000000-0000-0000-0000-000000000002','delivered',280000,0,0,0,280000,'COP',
 '{"full_name":"Juan David Prada","line1":"Cll 48 # 27-15","city":"Bucaramanga","phone":"3212345678"}','ZSO-2026-025','ZI-2026-025',NOW()-INTERVAL'13 days',NOW()-INTERVAL'7 days'),

('e0000000-0000-0000-0000-000000000026','ESZ-20260924-026','c0000000-0000-0000-0000-000000000007','delivered',165000,0,8000,0,173000,'COP',
 '{"full_name":"Diana Marcela Herrera","line1":"Cra 19 # 37-45","city":"Bucaramanga","phone":"3267890123"}','ZSO-2026-026','ZI-2026-026',NOW()-INTERVAL'11 days',NOW()-INTERVAL'5 days'),

('e0000000-0000-0000-0000-000000000027','ESZ-20260927-027','c0000000-0000-0000-0000-000000000001','delivered',414000,0,0,0,414000,'COP',
 '{"full_name":"Ana Sofía Moreno","line1":"Cra 35 # 48-22","city":"Bucaramanga","phone":"3201234567"}','ZSO-2026-027','ZI-2026-027',NOW()-INTERVAL'8 days',NOW()-INTERVAL'2 days'),

-- ENVIADAS (6) ────────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000028','ESZ-20260929-028','c0000000-0000-0000-0000-000000000006','shipped',227000,0,0,0,227000,'COP',
 '{"full_name":"Andrés Felipe Gómez","line1":"Cll 56 # 24-11","city":"Bucaramanga","phone":"3256789012"}','ZSO-2026-028',NULL,NOW()-INTERVAL'6 days',NOW()-INTERVAL'5 days'),

('e0000000-0000-0000-0000-000000000029','ESZ-20261001-029','c0000000-0000-0000-0000-000000000011','shipped',220000,0,0,0,220000,'COP',
 '{"full_name":"Valentina Niño","line1":"Cra 29 # 50-33","city":"Bucaramanga","phone":"3201234568"}','ZSO-2026-029',NULL,NOW()-INTERVAL'4 days',NOW()-INTERVAL'3 days'),

('e0000000-0000-0000-0000-000000000030','ESZ-20261002-030','c0000000-0000-0000-0000-000000000008','shipped',210000,0,0,0,210000,'COP',
 '{"full_name":"Sebastián Torres","line1":"Cll 45 # 31-22","city":"Bucaramanga","phone":"3278901234"}','ZSO-2026-030',NULL,NOW()-INTERVAL'3 days',NOW()-INTERVAL'2 days'),

('e0000000-0000-0000-0000-000000000031','ESZ-20261002-031','c0000000-0000-0000-0000-000000000016','shipped',200000,0,0,0,200000,'COP',
 '{"full_name":"Felipe Cárdenas","line1":"Cll 49 # 25-07","city":"Bucaramanga","phone":"3256789013"}','ZSO-2026-031',NULL,NOW()-INTERVAL'3 days',NOW()-INTERVAL'2 days'),

('e0000000-0000-0000-0000-000000000032','ESZ-20261003-032','c0000000-0000-0000-0000-000000000004','shipped',215000,0,0,0,215000,'COP',
 '{"full_name":"Luis Fernando Méndez","line1":"Cll 52 # 30-18","city":"Bucaramanga","phone":"3234567890"}','ZSO-2026-032',NULL,NOW()-INTERVAL'2 days',NOW()-INTERVAL'1 day'),

('e0000000-0000-0000-0000-000000000033','ESZ-20261003-033','c0000000-0000-0000-0000-000000000013','shipped',175000,0,8000,0,183000,'COP',
 '{"full_name":"Natalia Rueda","line1":"Cra 36 # 46-05","city":"Bucaramanga","phone":"3223456780"}','ZSO-2026-033',NULL,NOW()-INTERVAL'2 days',NOW()-INTERVAL'1 day'),

-- EN PROCESO (4) ──────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000034','ESZ-20261004-034','c0000000-0000-0000-0000-000000000012','processing',130000,0,8000,0,138000,'COP',
 '{"full_name":"Daniel Estrada","line1":"Cll 47 # 28-19","city":"Bucaramanga","phone":"3212345679"}','ZSO-2026-034',NULL,NOW()-INTERVAL'1 day',NOW()-INTERVAL'1 day'),

('e0000000-0000-0000-0000-000000000035','ESZ-20261004-035','c0000000-0000-0000-0000-000000000010','processing',280000,0,0,0,280000,'COP',
 '{"full_name":"Miguel Ángel Castro","line1":"Cll 60 # 23-08","city":"Bucaramanga","phone":"3290123456"}','ZSO-2026-035',NULL,NOW()-INTERVAL'1 day',NOW()-INTERVAL'1 day'),

('e0000000-0000-0000-0000-000000000036','ESZ-20261004-036','c0000000-0000-0000-0000-000000000009','processing',234000,0,0,0,234000,'COP',
 '{"full_name":"Isabella Ramírez","line1":"Cra 27 # 43-16","city":"Bucaramanga","phone":"3289012345"}','ZSO-2026-036',NULL,NOW()-INTERVAL'1 day',NOW()-INTERVAL'1 day'),

('e0000000-0000-0000-0000-000000000037','ESZ-20261005-037','c0000000-0000-0000-0000-000000000014','processing',284000,0,0,0,284000,'COP',
 '{"full_name":"Cristian Vargas","line1":"Cll 53 # 32-22","city":"Bucaramanga","phone":"3234567891"}','ZSO-2026-037',NULL,NOW()-INTERVAL'3 hours',NOW()-INTERVAL'3 hours'),

-- CONFIRMADAS (3) ─────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000038','ESZ-20261005-038','c0000000-0000-0000-0000-000000000015','confirmed',225000,0,0,0,225000,'COP',
 '{"full_name":"Mariana Álvarez","line1":"Cra 24 # 58-11","city":"Bucaramanga","phone":"3245678902"}',NULL,NULL,NOW()-INTERVAL'4 hours',NOW()-INTERVAL'4 hours'),

('e0000000-0000-0000-0000-000000000039','ESZ-20261005-039','c0000000-0000-0000-0000-000000000017','confirmed',210000,0,0,0,210000,'COP',
 '{"full_name":"Laura Delgado","line1":"Cra 31 # 44-28","city":"Bucaramanga","phone":"3267890124"}',NULL,NULL,NOW()-INTERVAL'5 hours',NOW()-INTERVAL'5 hours'),

('e0000000-0000-0000-0000-000000000040','ESZ-20261005-040','c0000000-0000-0000-0000-000000000006','confirmed',195000,0,8000,0,203000,'COP',
 '{"full_name":"Andrés Felipe Gómez","line1":"Cll 56 # 24-11","city":"Bucaramanga","phone":"3256789012"}',NULL,NULL,NOW()-INTERVAL'6 hours',NOW()-INTERVAL'6 hours'),

-- PENDIENTE (1) ───────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000041','ESZ-20261005-041','c0000000-0000-0000-0000-000000000018','pending',195000,0,8000,0,203000,'COP',
 '{"full_name":"Roberto Silva","line1":"Cll 55 # 33-14","city":"Bucaramanga","phone":"3278901235"}',NULL,NULL,NOW()-INTERVAL'2 hours',NOW()-INTERVAL'2 hours'),

-- CANCELADA extra ─────────────────────────────────────────────────
('e0000000-0000-0000-0000-000000000042','ESZ-20260730-042','c0000000-0000-0000-0000-000000000009','cancelled',122500,0,8000,0,130500,'COP',
 '{"full_name":"Isabella Ramírez","line1":"Cra 27 # 43-16","city":"Bucaramanga","phone":"3289012345"}',NULL,NULL,NOW()-INTERVAL'67 days',NOW()-INTERVAL'67 days');

-- ── 7. ITEMS POR ORDEN ────────────────────────────────────────

-- e001: Acqua di Gio 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000001',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-100ML';
-- e002: Bad Boy 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000002',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-006-100ML';
-- e003: Good Girl 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000003',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e004: Invictus 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000004',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-017-100ML';
-- e005: La Vie Est Belle 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000005',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-005-100ML';
-- e006: 9PM 100ml + Lattafa Sublime 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000006',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-003-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000006',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-008-100ML';
-- e007: Good Girl 100ml (Diana)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000007',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e008: Good Girl 100ml (Ana, 2da compra)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000008',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e009: Phantom 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000009',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-015-100ML';
-- e010: BFF 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000010',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-002-100ML';
-- e011: Polo Blue 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000011',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-011-100ML';
-- e012: Yara 100ml + Sublime 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000012',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-026-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000012',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-008-100ML';
-- e013: Acqua di Gio 50ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000013',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-50ML';
-- e014: Arabians Tonka 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000014',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-004-100ML';
-- e015: Burberry Her 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000015',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-007-100ML';
-- e016: 9PM 100ml + Good Girl 50ml (Ana, 3ra compra, cupón ESENZ15)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000016',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-003-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000016',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-50ML';
-- e017: Polo Blue 100ml (cancelada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000017',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-011-100ML';
-- e018: Bad Boy 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000018',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-006-100ML';
-- e019: La Vie Est Belle 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000019',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-005-100ML';
-- e020: Invictus 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000020',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-017-100ML';
-- e021: Acqua di Gio 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000021',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-100ML';
-- e022: 9PM 100ml (cupón BIENVENIDO10)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000022',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-003-100ML';
-- e023: Good Girl 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000023',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e024: Phantom 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000024',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-015-100ML';
-- e025: Arabians Tonka 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000025',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-004-100ML';
-- e026: Polo Blue 100ml
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000026',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-011-100ML';
-- e027: Acqua di Gio 100ml + Good Girl 100ml (Ana, 4ta compra — CLIENTE VIP)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000027',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000027',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e028: 9PM 100ml + Acqua di Gio 50ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000028',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-003-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000028',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-50ML';
-- e029: La Vie Est Belle 100ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000029',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-005-100ML';
-- e030: Bad Boy 100ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000030',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-006-100ML';
-- e031: Invictus 100ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000031',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-017-100ML';
-- e032: Born in Roma 100ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000032',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-029-100ML';
-- e033: Burberry Her 100ml (enviada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000033',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-007-100ML';
-- e034: Amber Oud Gold 100ml (procesando)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000034',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-027-100ML';
-- e035: Arabians Tonka 100ml (procesando)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000035',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-004-100ML';
-- e036: La Vie Est Belle 50ml + Yara 100ml (procesando)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000036',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-005-50ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000036',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-026-100ML';
-- e037: Acqua di Gio 100ml + 9PM 100ml (procesando)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000037',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-001-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000037',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-003-100ML';
-- e038: Good Girl 100ml (confirmada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000038',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-016-100ML';
-- e039: Bad Boy 100ml (confirmada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000039',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-006-100ML';
-- e040: Amber Rouge + Sublime (confirmada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000040',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-025-100ML';
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000040',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-008-100ML';
-- e041: Phantom 100ml (pendiente pago)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000041',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-015-100ML';
-- e042: Burberry Her 50ml (cancelada)
INSERT INTO order_items (order_id,product_id,variant_id,name,sku,quantity,unit_price,total)
SELECT 'e0000000-0000-0000-0000-000000000042',p.id,v.id,p.name||' — '||v.name,v.sku,1,v.price,v.price FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.sku='ESZ-007-50ML';

-- ── 8. PAGOS ──────────────────────────────────────────────────
INSERT INTO payments (order_id,provider,provider_ref,amount,currency,status,completed_at,created_at) VALUES
-- Julio (wompi)
('e0000000-0000-0000-0000-000000000001','wompi','CO-ESZ001-W8X2A1',197000,'COP','completed',NOW()-INTERVAL'83 days'+INTERVAL'25 minutes',NOW()-INTERVAL'83 days'),
('e0000000-0000-0000-0000-000000000002','wompi','CO-ESZ002-W9Y3B2',210000,'COP','completed',NOW()-INTERVAL'80 days'+INTERVAL'18 minutes',NOW()-INTERVAL'80 days'),
('e0000000-0000-0000-0000-000000000003','stripe','pi_3Pz8kL2eZvKYlo2C1MN4op5q',225000,'COP','completed',NOW()-INTERVAL'76 days'+INTERVAL'12 minutes',NOW()-INTERVAL'76 days'),
('e0000000-0000-0000-0000-000000000004','wompi','CO-ESZ004-W1K5D4',200000,'COP','completed',NOW()-INTERVAL'73 days'+INTERVAL'20 minutes',NOW()-INTERVAL'73 days'),
('e0000000-0000-0000-0000-000000000005','wompi','CO-ESZ005-W2L6E5',220000,'COP','completed',NOW()-INTERVAL'69 days'+INTERVAL'15 minutes',NOW()-INTERVAL'69 days'),
('e0000000-0000-0000-0000-000000000006','wompi','CO-ESZ006-W3M7F6',188000,'COP','completed',NOW()-INTERVAL'66 days'+INTERVAL'30 minutes',NOW()-INTERVAL'66 days'),
-- Agosto
('e0000000-0000-0000-0000-000000000007','stripe','pi_3Qa9mM3fAuLZmp3D2NO5pq6r',225000,'COP','completed',NOW()-INTERVAL'63 days'+INTERVAL'22 minutes',NOW()-INTERVAL'63 days'),
('e0000000-0000-0000-0000-000000000008','wompi','CO-ESZ008-W5P9H8',225000,'COP','completed',NOW()-INTERVAL'60 days'+INTERVAL'10 minutes',NOW()-INTERVAL'60 days'),
('e0000000-0000-0000-0000-000000000009','wompi','CO-ESZ009-W6Q0I9',203000,'COP','completed',NOW()-INTERVAL'57 days'+INTERVAL'35 minutes',NOW()-INTERVAL'57 days'),
('e0000000-0000-0000-0000-000000000010','wompi','CO-ESZ010-W7R1J0',128000,'COP','completed',NOW()-INTERVAL'54 days'+INTERVAL'28 minutes',NOW()-INTERVAL'54 days'),
('e0000000-0000-0000-0000-000000000011','wompi','CO-ESZ011-W8S2K1',173000,'COP','completed',NOW()-INTERVAL'51 days'+INTERVAL'14 minutes',NOW()-INTERVAL'51 days'),
('e0000000-0000-0000-0000-000000000012','wompi','CO-ESZ012-W9T3L2',173000,'COP','completed',NOW()-INTERVAL'48 days'+INTERVAL'19 minutes',NOW()-INTERVAL'48 days'),
('e0000000-0000-0000-0000-000000000013','wompi','CO-ESZ013-W0U4M3',140300,'COP','completed',NOW()-INTERVAL'45 days'+INTERVAL'42 minutes',NOW()-INTERVAL'45 days'),
('e0000000-0000-0000-0000-000000000014','stripe','pi_3Rb0nN4gBvMaqo4E3OP6qr7s',280000,'COP','completed',NOW()-INTERVAL'42 days'+INTERVAL'8 minutes', NOW()-INTERVAL'42 days'),
('e0000000-0000-0000-0000-000000000015','wompi','CO-ESZ015-W3X7P5',183000,'COP','completed',NOW()-INTERVAL'40 days'+INTERVAL'31 minutes',NOW()-INTERVAL'40 days'),
('e0000000-0000-0000-0000-000000000016','wompi','CO-ESZ016-W4Y8Q6',215000,'COP','completed',NOW()-INTERVAL'37 days'+INTERVAL'16 minutes',NOW()-INTERVAL'37 days'),
('e0000000-0000-0000-0000-000000000017','wompi','CO-ESZ017-WFAIL7',173000,'COP','failed',    NULL,                                             NOW()-INTERVAL'56 days'),
-- Septiembre
('e0000000-0000-0000-0000-000000000018','wompi','CO-ESZ018-W6A0S8',210000,'COP','completed',NOW()-INTERVAL'33 days'+INTERVAL'11 minutes',NOW()-INTERVAL'33 days'),
('e0000000-0000-0000-0000-000000000019','wompi','CO-ESZ019-W7B1T9',220000,'COP','completed',NOW()-INTERVAL'30 days'+INTERVAL'24 minutes',NOW()-INTERVAL'30 days'),
('e0000000-0000-0000-0000-000000000020','stripe','pi_3Sc1oO5hCwNbrp5F4PQ7rs8t',200000,'COP','completed',NOW()-INTERVAL'27 days'+INTERVAL'7 minutes',NOW()-INTERVAL'27 days'),
('e0000000-0000-0000-0000-000000000021','wompi','CO-ESZ021-W9D3V1',197000,'COP','completed',NOW()-INTERVAL'24 days'+INTERVAL'38 minutes',NOW()-INTERVAL'24 days'),
('e0000000-0000-0000-0000-000000000022','wompi','CO-ESZ022-W0E4W2', 93500,'COP','completed',NOW()-INTERVAL'21 days'+INTERVAL'17 minutes',NOW()-INTERVAL'21 days'),
('e0000000-0000-0000-0000-000000000023','wompi','CO-ESZ023-W1F5X3',225000,'COP','completed',NOW()-INTERVAL'18 days'+INTERVAL'29 minutes',NOW()-INTERVAL'18 days'),
('e0000000-0000-0000-0000-000000000024','wompi','CO-ESZ024-W2G6Y4',203000,'COP','completed',NOW()-INTERVAL'16 days'+INTERVAL'13 minutes',NOW()-INTERVAL'16 days'),
('e0000000-0000-0000-0000-000000000025','stripe','pi_3Td2pP6iDxOcsq6G5QR8st9u',280000,'COP','completed',NOW()-INTERVAL'13 days'+INTERVAL'5 minutes', NOW()-INTERVAL'13 days'),
('e0000000-0000-0000-0000-000000000026','wompi','CO-ESZ026-W4I8A6',173000,'COP','completed',NOW()-INTERVAL'11 days'+INTERVAL'44 minutes',NOW()-INTERVAL'11 days'),
('e0000000-0000-0000-0000-000000000027','wompi','CO-ESZ027-W5J9B7',414000,'COP','completed',NOW()-INTERVAL'8 days'+INTERVAL'21 minutes', NOW()-INTERVAL'8 days'),
-- Enviadas
('e0000000-0000-0000-0000-000000000028','wompi','CO-ESZ028-W6K0C8',227000,'COP','completed',NOW()-INTERVAL'6 days'+INTERVAL'33 minutes', NOW()-INTERVAL'6 days'),
('e0000000-0000-0000-0000-000000000029','wompi','CO-ESZ029-W7L1D9',220000,'COP','completed',NOW()-INTERVAL'4 days'+INTERVAL'9 minutes',  NOW()-INTERVAL'4 days'),
('e0000000-0000-0000-0000-000000000030','wompi','CO-ESZ030-W8M2E0',210000,'COP','completed',NOW()-INTERVAL'3 days'+INTERVAL'46 minutes', NOW()-INTERVAL'3 days'),
('e0000000-0000-0000-0000-000000000031','stripe','pi_3Ue3qQ7jEyPdtr7H6RS9tu0v',200000,'COP','completed',NOW()-INTERVAL'3 days'+INTERVAL'12 minutes',NOW()-INTERVAL'3 days'),
('e0000000-0000-0000-0000-000000000032','wompi','CO-ESZ032-W0O4G2',215000,'COP','completed',NOW()-INTERVAL'2 days'+INTERVAL'27 minutes', NOW()-INTERVAL'2 days'),
('e0000000-0000-0000-0000-000000000033','wompi','CO-ESZ033-W1P5H3',183000,'COP','completed',NOW()-INTERVAL'2 days'+INTERVAL'53 minutes', NOW()-INTERVAL'2 days'),
-- En proceso
('e0000000-0000-0000-0000-000000000034','wompi','CO-ESZ034-W2Q6I4',138000,'COP','completed',NOW()-INTERVAL'23 hours',NOW()-INTERVAL'1 day'),
('e0000000-0000-0000-0000-000000000035','wompi','CO-ESZ035-W3R7J5',280000,'COP','completed',NOW()-INTERVAL'22 hours',NOW()-INTERVAL'1 day'),
('e0000000-0000-0000-0000-000000000036','stripe','pi_3Vf4rR8kFzQeus8I7ST0uv1w',234000,'COP','completed',NOW()-INTERVAL'21 hours',NOW()-INTERVAL'1 day'),
('e0000000-0000-0000-0000-000000000037','wompi','CO-ESZ037-W5T9L7',284000,'COP','completed',NOW()-INTERVAL'3 hours',  NOW()-INTERVAL'3 hours'),
-- Confirmadas
('e0000000-0000-0000-0000-000000000038','wompi','CO-ESZ038-W6U0M8',225000,'COP','completed',NOW()-INTERVAL'4 hours',  NOW()-INTERVAL'4 hours'),
('e0000000-0000-0000-0000-000000000039','wompi','CO-ESZ039-W7V1N9',210000,'COP','completed',NOW()-INTERVAL'5 hours',  NOW()-INTERVAL'5 hours'),
('e0000000-0000-0000-0000-000000000040','wompi','CO-ESZ040-W8W2O0',203000,'COP','completed',NOW()-INTERVAL'6 hours',  NOW()-INTERVAL'6 hours'),
-- Pendiente
('e0000000-0000-0000-0000-000000000041','wompi',NULL,              203000,'COP','pending',   NULL,                    NOW()-INTERVAL'2 hours'),
-- Cancelada extra
('e0000000-0000-0000-0000-000000000042','wompi','CO-ESZ042-WFAIL9',130500,'COP','failed',    NULL,                    NOW()-INTERVAL'67 days');

-- ── 9. RESEÑAS (aprobadas) ────────────────────────────────────
INSERT INTO reviews (product_id,user_id,rating,title,body,is_approved,created_at) VALUES
-- Good Girl
((SELECT id FROM products WHERE sku='ESZ-016'),'c0000000-0000-0000-0000-000000000003',5,'Absolutamente adictivo','Es el perfume que más me han preguntado en mi vida. Dura más de 12 horas y el frasco es una obra de arte. 100% recomendado.',TRUE,NOW()-INTERVAL'70 days'),
((SELECT id FROM products WHERE sku='ESZ-016'),'c0000000-0000-0000-0000-000000000005',5,'Mi fragancia favorita','Ya voy por mi segunda botella. No puedo salir sin él. Recibo piropos constantemente.',TRUE,NOW()-INTERVAL'45 days'),
((SELECT id FROM products WHERE sku='ESZ-016'),'c0000000-0000-0000-0000-000000000015',5,'Regalo perfecto','Le regalé este perfume a mi hermana y quedó encantada. Lo recomiendo al 100% como regalo.',TRUE,NOW()-INTERVAL'28 days'),
-- Acqua di Gio
((SELECT id FROM products WHERE sku='ESZ-001'),'c0000000-0000-0000-0000-000000000002',5,'El clásico que nunca falla','Llevaba años buscando dónde conseguirlo a buen precio. En Esenzzia lo encontré y la calidad es impecable.',TRUE,NOW()-INTERVAL'74 days'),
((SELECT id FROM products WHERE sku='ESZ-001'),'c0000000-0000-0000-0000-000000000017',5,'Fresco y elegante','Es el perfume de mi papá desde hace 20 años. Le regalé una botella y me dijo que es exactamente el mismo de siempre.',TRUE,NOW()-INTERVAL'22 days'),
((SELECT id FROM products WHERE sku='ESZ-001'),'c0000000-0000-0000-0000-000000000014',4,'Excelente calidad','Muy buena proyección y duración. Llega perfecto en empaque seguro. Solo le doy 4 porque quisiera más tiempo de entrega.',TRUE,NOW()-INTERVAL'12 days'),
-- 9PM Afnan
((SELECT id FROM products WHERE sku='ESZ-003'),'c0000000-0000-0000-0000-000000000006',5,'El mejor oud que he olido','Increíble relación calidad-precio. Recibo más piropos con este que con fragancias de $500k. Un descubrimiento.',TRUE,NOW()-INTERVAL'60 days'),
((SELECT id FROM products WHERE sku='ESZ-003'),'c0000000-0000-0000-0000-000000000018',5,'Adictivo y elegante','Para las noches no hay nada mejor. La proyección es brutal y dura toda la noche.',TRUE,NOW()-INTERVAL'18 days'),
((SELECT id FROM products WHERE sku='ESZ-003'),'c0000000-0000-0000-0000-000000000004',4,'Muy buena compra','Me llegó rápido y bien empacado. El perfume huele exactamente como dicen. Muy satisfecho.',TRUE,NOW()-INTERVAL'49 days'),
-- La Vie Est Belle
((SELECT id FROM products WHERE sku='ESZ-005'),'c0000000-0000-0000-0000-000000000005',5,'Amo este perfume','El gourmand más elegante que existe. Huele a felicidad pura. Lo he regalado 3 veces y siempre es un éxito.',TRUE,NOW()-INTERVAL'63 days'),
((SELECT id FROM products WHERE sku='ESZ-005'),'c0000000-0000-0000-0000-000000000019',5,'Mi perfume de novia','Me lo regaló mi novio y desde entonces no uso otro. Recibo piropos todos los días.',TRUE,NOW()-INTERVAL'26 days'),
-- Arabians Tonka
((SELECT id FROM products WHERE sku='ESZ-004'),'c0000000-0000-0000-0000-000000000012',5,'Lujo absoluto','No puedo creer la calidad a este precio. Huele a perfumería de lujo árabe. Definitivamente lo vuelvo a comprar.',TRUE,NOW()-INTERVAL'36 days'),
-- Phantom
((SELECT id FROM products WHERE sku='ESZ-015'),'c0000000-0000-0000-0000-000000000008',4,'Moderno y diferente','Muy original, combina bien con todo. La lavanda robótica es única. Solo 4 estrellas porque esperaba más duración.',TRUE,NOW()-INTERVAL'50 days'),
-- Invictus
((SELECT id FROM products WHERE sku='ESZ-017'),'c0000000-0000-0000-0000-000000000016',5,'Ganador por definición','El perfume deportivo más elegante. Lo uso para el gimnasio y para el trabajo por igual.',TRUE,NOW()-INTERVAL'21 days'),
-- Bad Boy
((SELECT id FROM products WHERE sku='ESZ-006'),'c0000000-0000-0000-0000-000000000014',5,'Único en su clase','El frasco en forma de rayo ya lo dice todo. Huele a poder y elegancia. Mi favorito para salir de noche.',TRUE,NOW()-INTERVAL'16 days');

-- ── 10. SUSCRIPTORES NEWSLETTER ───────────────────────────────
INSERT INTO newsletter_subscribers (email,first_name,is_active,created_at) VALUES
('ana.moreno@gmail.com',       'Ana Sofía',    TRUE, NOW()-INTERVAL'120 days'),
('juan.prada@hotmail.com',     'Juan David',   TRUE, NOW()-INTERVAL'110 days'),
('camila.rios@gmail.com',      'Camila',       TRUE, NOW()-INTERVAL'105 days'),
('luisfer.mendez@gmail.com',   'Luis Fernando',TRUE, NOW()-INTERVAL'100 days'),
('paola.suarez@yahoo.com',     'Paola',        TRUE, NOW()-INTERVAL'95 days'),
('andres.gomez@gmail.com',     'Andrés',       TRUE, NOW()-INTERVAL'92 days'),
('diana.herrera@gmail.com',    'Diana',        TRUE, NOW()-INTERVAL'88 days'),
('sebas.torres@gmail.com',     'Sebastián',    TRUE, NOW()-INTERVAL'85 days'),
('isabella.ramirez@gmail.com', 'Isabella',     TRUE, NOW()-INTERVAL'80 days'),
('miguel.castro@gmail.com',    'Miguel',       TRUE, NOW()-INTERVAL'75 days'),
('valen.nino@gmail.com',       'Valentina',    TRUE, NOW()-INTERVAL'72 days'),
('daniel.estrada@hotmail.com', 'Daniel',       TRUE, NOW()-INTERVAL'70 days'),
('natalia.rueda@gmail.com',    'Natalia',      TRUE, NOW()-INTERVAL'65 days'),
('cristian.vargas@gmail.com',  'Cristian',     TRUE, NOW()-INTERVAL'60 days'),
('mariana.alvarez@gmail.com',  'Mariana',      TRUE, NOW()-INTERVAL'55 days'),
('felipe.cardenas@gmail.com',  'Felipe',       TRUE, NOW()-INTERVAL'50 days'),
('laura.delgado@gmail.com',    'Laura',        TRUE, NOW()-INTERVAL'45 days'),
('roberto.silva@gmail.com',    'Roberto',      TRUE, NOW()-INTERVAL'42 days'),
('sofia.pineda@gmail.com',     'Sofía',        TRUE, NOW()-INTERVAL'30 days'),
('jose.reyes@hotmail.com',     'José',         TRUE, NOW()-INTERVAL'20 days')
ON CONFLICT (email) DO NOTHING;

-- ── 11. CONVERSACIONES VALENTINA (IA) ─────────────────────────
INSERT INTO chat_conversations (user_id,session_id,messages,created_at,updated_at) VALUES

('c0000000-0000-0000-0000-000000000003','sess-camila-rios-001',
'[
  {"role":"user","content":"Hola! Quiero un perfume para regalarle a mi mamá, ella tiene 50 años y le gustan las flores.","ts":"2026-09-10T14:23:00Z"},
  {"role":"assistant","content":"¡Hola Camila! Qué bonito detalle para tu mamá 💛 Para una mujer de 50 años que ama las flores, te recomiendo dos opciones perfectas: **La Vie Est Belle de Lancôme** ($220.000) — es un floral gourmand con iris, praline y vainilla, muy elegante y femenino. Es el más vendido en Francia. O **Good Girl de Carolina Herrera** ($225.000) — jazmín, cacao y tonka en un frasco stiletto icónico. Las dos duran más de 8 horas. ¿Cuál prefiere tu mamá, algo más dulce o más fresco?","ts":"2026-09-10T14:23:05Z"},
  {"role":"user","content":"La vie est belle suena perfecto! La agrego al carrito. Cuánto demora el envío?","ts":"2026-09-10T14:24:15Z"},
  {"role":"assistant","content":"¡Excelente elección! Tu mamá va a quedar encantada 🌸 El envío a Bucaramanga demora **1-2 días hábiles**. Si el pedido total supera $200.000 el envío es gratis — y La Vie Est Belle 100ml ya cumple esa condición. ¿Quieres que te ayude a finalizar el pedido?","ts":"2026-09-10T14:24:18Z"},
  {"role":"user","content":"Si! Gracias Valentina","ts":"2026-09-10T14:25:00Z"},
  {"role":"assistant","content":"¡Con mucho gusto! Que disfrutes el regalo y que tu mamá se sienta muy especial 💐 Si necesitas algo más, aquí estaré.","ts":"2026-09-10T14:25:03Z"}
]'::jsonb,NOW()-INTERVAL'16 days',NOW()-INTERVAL'16 days'),

('c0000000-0000-0000-0000-000000000008','sess-sebas-torres-002',
'[
  {"role":"user","content":"Hola, quisiera saber el estado de mi pedido ESZ-20261002-030","ts":"2026-10-03T10:15:00Z"},
  {"role":"assistant","content":"¡Hola Sebastián! Déjame revisar tu pedido 🔍\n\nTu pedido **ESZ-20261002-030** — *Bad Boy de Carolina Herrera 100ml* — está en estado **ENVIADO** ✈️\n\nFue despachado desde nuestras instalaciones el 2 de octubre y está en camino a **Cll 45 # 31-22, Barrio Provenza, Bucaramanga**. Tiempo estimado de llegada: **hoy o mañana** antes de las 6pm.\n\n¿Necesitas algo más?","ts":"2026-10-03T10:15:04Z"},
  {"role":"user","content":"Perfecto gracias! Y si no llega hoy puedo hacer algo?","ts":"2026-10-03T10:16:30Z"},
  {"role":"assistant","content":"¡Claro! Si el pedido no llega mañana 4 de octubre antes de las 6pm, contáctanos por WhatsApp al **wa.me/13157...** y gestionamos el seguimiento con la transportadora. En casos raros de demora damos un cupón de $15.000 para tu próxima compra 🎁 Pero no te preocupes, el 98% de pedidos en Bucaramanga llegan en tiempo.","ts":"2026-10-03T10:16:34Z"}
]'::jsonb,NOW()-INTERVAL'2 days',NOW()-INTERVAL'2 days'),

('c0000000-0000-0000-0000-000000000006','sess-andres-gomez-003',
'[
  {"role":"user","content":"Qué diferencia hay entre el 9PM y el Arabians Tonka? Los dos son árabes?","ts":"2026-09-28T19:45:00Z"},
  {"role":"assistant","content":"¡Buena pregunta Andrés! Aquí te lo explico:\n\n**9PM de Afnan** ($95.000) → Es intenso y sensual: ámbar, tonka y especias. Perfectamente calibrado para **noches de salida**, deja una estela irresistible. Duración: 8-10h. Ideal si buscas impacto a buen precio.\n\n**Arabians Tonka de Montale** ($280.000) → Es la versión **nicho y lujosa** del mismo concepto. Más complejo, con capas de oud, madera de cachemira y tonka premium. Para quienes quieren destacar en cualquier reunión de alto nivel. Duración: 12-14h.\n\nEn resumen: **9PM** = impacto y precio. **Arabians Tonka** = lujo y complejidad. ¿Para qué ocasión lo buscas?","ts":"2026-09-28T19:45:06Z"},
  {"role":"user","content":"Para salir de noche los fines de semana. Creo que voy con el 9PM primero","ts":"2026-09-28T19:47:10Z"},
  {"role":"assistant","content":"Perfecta decisión 🔥 El **9PM** para noches de fin de semana es simplemente imbatible. Es el favorito de nuestros clientes jóvenes y el que más recomendaciones genera. Y cuando quieras dar el salto al mundo nicho, el Arabians Tonka te va a volar la cabeza 😄 ¿Lo agrego a tu carrito?","ts":"2026-09-28T19:47:13Z"}
]'::jsonb,NOW()-INTERVAL'7 days',NOW()-INTERVAL'7 days'),

(NULL,'sess-anonimo-consulta-004',
'[
  {"role":"user","content":"Tienen Dior Sauvage?","ts":"2026-10-04T16:30:00Z"},
  {"role":"assistant","content":"¡Hola! Actualmente no tenemos Dior Sauvage en nuestro catálogo, pero te tengo alternativas **muy similares** y a mejor precio:\n\n🥇 **Acqua di Gio de Giorgio Armani** ($189.000) — El rival directo. Fresco marino con la misma elegancia. Muchos dicen que Sauvage lo copió 😄\n\n🥈 **Starwalker de Mont Blanc** ($155.000) — Menta ártica y cedro, muy similar al perfil de Sauvage.\n\n🥉 **Phantom de Paco Rabanne** ($195.000) — Si buscas algo más atrevido y único.\n\n¿Quieres que te cuente más de alguno?","ts":"2026-10-04T16:30:05Z"},
  {"role":"user","content":"El acqua di gio cuánto dura?","ts":"2026-10-04T16:31:20Z"},
  {"role":"assistant","content":"El **Acqua di Gio** tiene una duración de **6-8 horas** con buena proyección las primeras 2-3 horas y luego se convierte en un aura sutil cerca de la piel — lo que se llama sillage. Es perfecto para el día y ambientes de trabajo. Si buscas algo que dure más, el **Phantom** llega a las 8-10 horas con mayor intensidad. ¿Lo pruebas? Contamos con la talla de 100ml a $189.000 con envío gratis 🚀","ts":"2026-10-04T16:31:24Z"}
]'::jsonb,NOW()-INTERVAL'1 day',NOW()-INTERVAL'1 day');

-- ── 12. MOVIMIENTOS DE INVENTARIO (muestra historial) ─────────
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id, 50,'restock','a0000000-0000-0000-0000-000000000001'::UUID, NOW()-INTERVAL'90 days'
FROM product_variants v WHERE v.sku='ESZ-001-100ML';

INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id, 50,'restock','a0000000-0000-0000-0000-000000000001'::UUID, NOW()-INTERVAL'90 days'
FROM product_variants v WHERE v.sku='ESZ-016-100ML';

INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id, 30,'restock','a0000000-0000-0000-0000-000000000001'::UUID, NOW()-INTERVAL'90 days'
FROM product_variants v WHERE v.sku='ESZ-004-100ML';

INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'83 days'  FROM product_variants v WHERE v.sku='ESZ-001-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'60 days'  FROM product_variants v WHERE v.sku='ESZ-001-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'24 days'  FROM product_variants v WHERE v.sku='ESZ-001-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'8 days'   FROM product_variants v WHERE v.sku='ESZ-001-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'3 hours'  FROM product_variants v WHERE v.sku='ESZ-001-100ML';

INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'42 days'  FROM product_variants v WHERE v.sku='ESZ-004-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'13 days'  FROM product_variants v WHERE v.sku='ESZ-004-100ML';
INSERT INTO inventory_movements (variant_id,delta,reason,created_by,created_at)
SELECT v.id,-1,'sale',NULL, NOW()-INTERVAL'1 day'    FROM product_variants v WHERE v.sku='ESZ-004-100ML';

-- ── FIN DEL SEED ──────────────────────────────────────────────
-- Resumen para la demo:
--   42 órdenes | 18 clientes | 6 empleados | 15 reseñas | 20 suscriptores
--   Ingresos julio: ~$1.24M COP | agosto: ~$1.95M COP | septiembre: ~$2.22M COP
--   Cliente VIP: Ana Sofía Moreno — 4 órdenes, $1.05M COP en total
--   Stock crítico: ESZ-001-100ML (3 uds), ESZ-004-100ML (2 uds)
--   Stock bajo: ESZ-016-100ML (4 uds), ESZ-003-100ML (6 uds)
--   Pipeline activo: 13 órdenes enviadas/en proceso/confirmadas/pendientes = $3.03M COP
