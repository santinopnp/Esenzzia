const express = require('express');
const router = express.Router();
const productService = require('../../services/productService');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { query } = require('../../config/postgres');
const Joi = require('joi');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort, search } = req.query;
    const result = await productService.listProducts({ page: +page, limit: +limit, category, sort, search });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) return res.json([]);
    const results = await productService.searchProducts(q, +limit);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slugOrId', async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.slugOrId);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST review
router.post('/:id/reviews', requireAuth, async (req, res) => {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().max(100).optional().allow(''),
    body: Joi.string().max(1000).optional().allow(''),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Check if user already reviewed
    const existing = await query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Ya has reseñado este producto' });
    }
    const result = await query(
      `INSERT INTO reviews (product_id, user_id, rating, title, body)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.params.id, req.user.id, value.rating, value.title || null, value.body || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate coupon (used by checkout)
router.post('/validate-coupon', optionalAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Código requerido' });
    const result = await query(
      `SELECT * FROM coupons
       WHERE code = $1 AND is_active = true
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (usage_limit IS NULL OR usage_count < usage_limit)`,
      [code.toUpperCase()]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cupón inválido o expirado' });
    const coupon = result.rows[0];
    res.json({ valid: true, discount_percent: coupon.discount_percent, code: coupon.code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
