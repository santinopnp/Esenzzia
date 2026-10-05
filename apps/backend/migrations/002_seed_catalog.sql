-- Esenzzia product catalog seed
-- 33 perfumes + categories

-- Categories
INSERT INTO categories (id, slug, name, description, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'hombre',    'Hombre',         'Fragancias masculinas',      1),
  ('00000000-0000-0000-0000-000000000002', 'mujer',     'Mujer',          'Fragancias femeninas',       2),
  ('00000000-0000-0000-0000-000000000003', 'unisex',    'Unisex',         'Fragancias unisex',          3),
  ('00000000-0000-0000-0000-000000000004', 'arabicos',  'Arabicos',       'Perfumes de Medio Oriente',  4),
  ('00000000-0000-0000-0000-000000000005', 'nicho',     'Nicho',          'Fragancias de nicho',        5)
ON CONFLICT (slug) DO NOTHING;

-- Products (33 perfumes del catalogo Esenzzia)
INSERT INTO products (sku, slug, name, brand, gender, fragrance_family, price, currency, is_active, is_featured, category_id, short_desc) VALUES
  ('ESZ-001', 'armani-acqua-di-gio', 'Acqua di Gio', 'Giorgio Armani', 'masculine', 'aquatic',
   189000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000001',
   'El icónico fresco acuático de Armani. Notas de bergamota, jazmín marino y almizcle.'),

  ('ESZ-002', 'bff-kim-kardashian', 'BFF', 'Kim Kardashian', 'feminine', 'floral',
   120000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Frutas tropicales, flores blancas y madera de cachemira.'),

  ('ESZ-003', 'afnan-9pm', '9PM', 'Afnan', 'masculine', 'oriental',
   95000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000001',
   'El best-seller árabe. Ambar, tonka y especias con una presencia hipnótica.'),

  ('ESZ-004', 'montale-arabians-tonka', 'Arabians Tonka', 'Montale', 'unisex', 'oriental',
   280000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000005',
   'Lujo árabe con tonka, ambar y madera de oud en su máxima expresión.'),

  ('ESZ-005', 'lancome-la-vie-est-belle', 'La Vie Est Belle', 'Lancôme', 'feminine', 'gourmand',
   220000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000002',
   'Iris, praline y vainilla en el gourmand floral más vendido de Francia.'),

  ('ESZ-006', 'carolina-herrera-bad-boy', 'Bad Boy', 'Carolina Herrera', 'masculine', 'woody',
   210000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000001',
   'Cedro, cacao y lavanda en un frasco de relámpago icónico.'),

  ('ESZ-007', 'burberry-her', 'Her', 'Burberry', 'feminine', 'fruity',
   175000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Frutos rojos de Londres, violeta y almizcle moderno.'),

  ('ESZ-008', 'lattafa-sublime', 'Sublime', 'Lattafa', 'unisex', 'oriental',
   85000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000004',
   'Dulce oriental con notas de canela, vainilla y oud.'),

  ('ESZ-009', 'bvlgari-omnia-coral', 'Omnia Coral', 'Bvlgari', 'feminine', 'floral',
   198000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Hibisco, mandarina y almizcle marino en un fresco floral.'),

  ('ESZ-010', 'lacoste-red', 'Red', 'Lacoste', 'masculine', 'citrus',
   140000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Menta, pimiento rojo y cedro en un fresco moderno.'),

  ('ESZ-011', 'ralph-lauren-polo-blue', 'Polo Blue', 'Ralph Lauren', 'masculine', 'aquatic',
   165000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Melón, salvia y madera de gaiac en el acuático americano por excelencia.'),

  ('ESZ-012', 'abu-dhabi', 'Abu Dhabi', 'Lattafa', 'unisex', 'oriental',
   78000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000004',
   'Oud, sándalo y ámbar inspirado en la capital de los Emiratos.'),

  ('ESZ-013', 'dubai-lattafa', 'Dubai', 'Lattafa', 'unisex', 'oriental',
   75000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000004',
   'Rosa, oud y especias: la esencia del lujo de Dubai.'),

  ('ESZ-014', 'fantasy-britney-spears', 'Fantasy', 'Britney Spears', 'feminine', 'gourmand',
   99000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Kiwi, jazmín y almizcle en el gourmand pop más querido.'),

  ('ESZ-015', 'paco-rabanne-phantom', 'Phantom', 'Paco Rabanne', 'masculine', 'woody',
   195000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000001',
   'Lavanda robot, limón y madera de vetiver para el hombre del futuro.'),

  ('ESZ-016', 'carolina-herrera-good-girl', 'Good Girl', 'Carolina Herrera', 'feminine', 'oriental',
   225000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000002',
   'Jasmin, cacao y tonka en el stiletto de perfume mas famoso del mundo.'),

  ('ESZ-017', 'paco-rabanne-invictus', 'Invictus', 'Paco Rabanne', 'masculine', 'aquatic',
   200000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000001',
   'Pomelo, laurel marino y guayaco para el hombre victorioso.'),

  ('ESZ-018', 'moschino-toy-boy', 'Toy Boy', 'Moschino', 'masculine', 'oriental',
   180000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Azafran, cedro y patchouli en el juguete mas sofisticado de Moschino.'),

  ('ESZ-019', 'lattafa-eclair', 'Eclair', 'Lattafa', 'unisex', 'floral',
   82000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000004',
   'Aldehídos florales con toque moderno y larga duración.'),

  ('ESZ-020', 'armaf-mandarin-sky', 'Mandarin Sky', 'Armaf', 'unisex', 'citrus',
   90000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000003',
   'Mandarina fresca, jazmín y madera cálida.'),

  ('ESZ-021', 'diesel-plus-plus', 'Plus Plus', 'Diesel', 'masculine', 'woody',
   135000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Madera de cedro, musgo y almizcle en un fougere robusto.'),

  ('ESZ-022', 'lacoste-blanc', 'Blanc', 'Lacoste', 'masculine', 'citrus',
   138000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Limón, albahaca y cedro blanco para el hombre activo.'),

  ('ESZ-023', 'althaïr', 'Althaïr', 'Orientica', 'unisex', 'oriental',
   115000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000004',
   'Oud, rosas y especias en una composición árabe contemporánea.'),

  ('ESZ-024', 'loquito-por-ti', 'Loquito Por Ti', 'Shakira', 'feminine', 'floral',
   88000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Frutas tropicales y flores con el sello de la artista colombiana.'),

  ('ESZ-025', 'orientica-amber-rouge', 'Amber Rouge', 'Orientica', 'unisex', 'oriental',
   110000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000004',
   'Ambar dorado, especias y madera de oud para noches especiales.'),

  ('ESZ-026', 'lattafa-yara', 'Yara', 'Lattafa', 'feminine', 'floral',
   80000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000002',
   'Rosa, lichi y almizcle: el superventas femenino de Lattafa.'),

  ('ESZ-027', 'al-haramain-amber-oud-gold', 'Amber Oud Gold', 'Al Haramain', 'unisex', 'oriental',
   130000, 'COP', TRUE, TRUE, '00000000-0000-0000-0000-000000000004',
   'Oud, ambar y vainilla en una de las mejores relaciones calidad-precio del mercado.'),

  ('ESZ-028', 'bharara-king', 'King', 'Bharara', 'masculine', 'woody',
   95000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Notas maderosas y especiadas para el hombre que impone.'),

  ('ESZ-029', 'valentino-born-in-roma', 'Born in Roma', 'Valentino', 'masculine', 'woody',
   215000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Vetiver, lavanda y ambroxan en el romano moderno.'),

  ('ESZ-030', 'antonio-banderas-blue-seduction', 'Blue Seduction', 'Antonio Banderas', 'masculine', 'aquatic',
   65000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Melon acuático, canela y madera suave. Excelente relación precio-calidad.'),

  ('ESZ-031', 'mont-blanc-starwalker', 'Starwalker', 'Mont Blanc', 'masculine', 'fresh',
   155000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Menta ártica, cedro blanco y almizcle lunar para el explorador moderno.'),

  ('ESZ-032', 'armani-acqua-fresca', 'Acqua di Gio Acqua Fresca', 'Giorgio Armani', 'masculine', 'aquatic',
   195000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Versión fresca y cítrica del clásico Acqua di Gio con notas marinas reforzadas.'),

  ('ESZ-033', 'burberry-brit', 'Brit', 'Burberry', 'masculine', 'woody',
   170000, 'COP', TRUE, FALSE, '00000000-0000-0000-0000-000000000001',
   'Jengibre, cardamomo y madera seca en un britishness atemporal.')
ON CONFLICT (sku) DO NOTHING;

-- Default variants (100ml) for each product
INSERT INTO product_variants (product_id, sku, name, volume_ml, price, stock)
SELECT id, sku || '-100ML', '100 ml', 100, price, 20
FROM products
ON CONFLICT (sku) DO NOTHING;

-- 50ml variants at 70% of 100ml price
INSERT INTO product_variants (product_id, sku, name, volume_ml, price, stock)
SELECT id, sku || '-50ML', '50 ml', 50, ROUND(price * 0.70), 15
FROM products
ON CONFLICT (sku) DO NOTHING;

-- 30ml variants at 45% of 100ml price
INSERT INTO product_variants (product_id, sku, name, volume_ml, price, stock)
SELECT id, sku || '-30ML', '30 ml', 30, ROUND(price * 0.45), 10
FROM products
ON CONFLICT (sku) DO NOTHING;
