const { query } = require('../config/postgres');

async function listProducts({ categorySlug, search, page = 1, limit = 24, sort = 'created_at', featured }) {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = ['p.is_active = TRUE'];

  if (categorySlug) {
    params.push(categorySlug);
    conditions.push(`c.slug = $${params.length}`);
  }
  if (search) {
    params.push(search);
    conditions.push(`to_tsvector('spanish', p.name || ' ' || coalesce(p.description,'')) @@ plainto_tsquery('spanish', $${params.length})`);
  }
  if (featured) {
    conditions.push('p.is_featured = TRUE');
  }

  const where = conditions.join(' AND ');
  const orderMap = {
    price_asc:  'p.price ASC',
    price_desc: 'p.price DESC',
    name:       'p.name ASC',
    created_at: 'p.created_at DESC',
  };
  const order = orderMap[sort] || 'p.created_at DESC';

  params.push(limit, offset);
  const sql = `
    SELECT p.id, p.slug, p.name, p.short_desc, p.brand, p.price, p.compare_price,
           p.currency, p.images, p.is_featured, p.fragrance_family, p.gender,
           c.name AS category_name, c.slug AS category_slug,
           COALESCE(rv.avg_rating, 0) AS avg_rating,
           COALESCE(rv.review_count, 0) AS review_count
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN (
      SELECT product_id, ROUND(AVG(rating)::numeric,1) AS avg_rating, COUNT(*) AS review_count
      FROM reviews WHERE is_approved = TRUE GROUP BY product_id
    ) rv ON rv.product_id = p.id
    WHERE ${where}
    ORDER BY ${order}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countSql = `
    SELECT COUNT(*) FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${where}
  `;

  const [rows, countResult] = await Promise.all([
    query(sql, params),
    query(countSql, params.slice(0, -2)),
  ]);

  return {
    products: rows.rows,
    total:    parseInt(countResult.rows[0].count, 10),
    page,
    pages:    Math.ceil(countResult.rows[0].count / limit),
  };
}

async function getProduct(slug) {
  const res = await query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = $1 AND p.is_active = TRUE
  `, [slug]);

  const product = res.rows[0];
  if (!product) return null;

  const [variants, reviews] = await Promise.all([
    query('SELECT * FROM product_variants WHERE product_id = $1 AND is_active = TRUE ORDER BY volume_ml', [product.id]),
    query(`SELECT r.rating, r.title, r.body, r.created_at, u.first_name
           FROM reviews r LEFT JOIN users u ON u.id = r.user_id
           WHERE r.product_id = $1 AND r.is_approved = TRUE
           ORDER BY r.created_at DESC LIMIT 10`, [product.id]),
  ]);

  return { ...product, variants: variants.rows, reviews: reviews.rows };
}

async function listCategories() {
  const res = await query(
    'SELECT * FROM categories WHERE is_active = TRUE ORDER BY sort_order, name'
  );
  return res.rows;
}

async function getFeaturedProducts(limit = 8) {
  const { products } = await listProducts({ featured: true, limit });
  return products;
}

async function searchProducts(q, limit = 10) {
  const res = await query(`
    SELECT id, slug, name, price, currency, images
    FROM products
    WHERE is_active = TRUE
      AND to_tsvector('spanish', name || ' ' || coalesce(short_desc,'')) @@ plainto_tsquery('spanish', $1)
    ORDER BY ts_rank(to_tsvector('spanish', name), plainto_tsquery('spanish', $1)) DESC
    LIMIT $2
  `, [q, limit]);
  return res.rows;
}

module.exports = { listProducts, getProduct, listCategories, getFeaturedProducts, searchProducts };
